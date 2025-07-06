package net.zorphy.backend.project.qwirkle.service.util;

import net.zorphy.backend.project.qwirkle.dto.Shape;
import nu.pattern.OpenCV;
import org.opencv.core.*;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;

public class OpenCVUtil {
    private static final boolean DEBUG = true;
    private static final String basePath = "C:\\Users\\Zorman\\Zorman\\Privat\\Programme\\Java\\WebApplication\\backend\\opencv\\";

    public static void main(String[] args) {
        OpenCV.loadLocally();

        byte[] file = loadStaticFile();
        Mat image = Imgcodecs.imdecode(new MatOfByte(file), Imgcodecs.IMREAD_COLOR);
        parseImage(image);
    }

    public static Mat parseImage(Mat image) {
        saveImage("original", image);

        Mat boosted = boostColors(image);
        saveImage("boosted", boosted);

        //blur
        Mat blurred = new Mat();
        Imgproc.GaussianBlur(boosted, blurred, new Size(11, 11), 0);
        saveImage("blurred", blurred);

        //edge detection
        Mat edged = new Mat();
        Imgproc.Canny(blurred, edged, 60, 150);  // Play with thresholds
        saveImage("edged", edged);

        //close edge holes
        Mat closed = new Mat();
        Mat kernel = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, new Size(10, 10));
        Imgproc.morphologyEx(edged, closed, Imgproc.MORPH_CLOSE, kernel);
        saveImage("closed", closed);

        //find contours
        Mat contoured = findContours(closed, boosted);
        saveImage("contoured", contoured);

        return contoured;
    }

    private static Mat findContours(Mat closed, Mat boosted) {
        List<MatOfPoint> contours = new ArrayList<>();
        Mat hierarchy = new Mat();
        Imgproc.findContours(closed, contours, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_SIMPLE);

        Mat highlighted = new Mat(closed.size(), CvType.CV_8UC3, new Scalar(0, 0, 0)); // Black background
        // Iterate through the found contours and draw them
        for (int i = 0; i < contours.size(); i++) {
            MatOfPoint contour = contours.get(i);
            double area = Imgproc.contourArea(contours.get(i));

            // only check contours with big enough area
            if (area > 40) {
                // Approximate the contour to a polygon to simplify its shape
                /*MatOfPoint2f contour2f = new MatOfPoint2f(contours.get(i).toArray());
                double perimeter = Imgproc.arcLength(contour2f, true);
                MatOfPoint2f approx = new MatOfPoint2f();
                Imgproc.approxPolyDP(contour2f, approx, 0.04 * perimeter, true);

                // Convert back to MatOfPoint for drawing
                MatOfPoint approxContour = new MatOfPoint(approx.toArray());*/

                //highlight contour
                Imgproc.drawContours(highlighted, contours, i, new Scalar(0, 255, 0), 2); // Green outline, 2px thick
                //Imgproc.drawContours(highlighted, contours, i, new Scalar(255, 255, 255), Core.FILLED); // Fill with white

                //predict color and shape
                Scalar color = classifyColor(closed, contour);
                ShapePrediction prediction = classifyShape(contour);

                //show prediction text
                Rect boundingBox = Imgproc.boundingRect(contour);
                int centerX = boundingBox.x + boundingBox.width / 2;
                int centerY = boundingBox.y + boundingBox.height / 2;

                Imgproc.putText(highlighted,
                        prediction.label(),
                        new Point(centerX - 30, centerY),
                        Imgproc.FONT_HERSHEY_SIMPLEX,
                        0.6,
                        color,
                        2);
            }
        }

        return highlighted;
    }

    private static Scalar classifyColor(Mat image, MatOfPoint contour) {
        // Create a mask for the contour
        Mat mask = Mat.zeros(image.size(), CvType.CV_8UC1);
        Imgproc.drawContours(mask, Collections.singletonList(contour), -1, new Scalar(255), Core.FILLED);

        // Compute the average color in BGR
        Scalar meanBGR = Core.mean(image, mask);

        // Convert BGR to HSV
        Mat bgrColor = new Mat(1, 1, CvType.CV_8UC3);
        bgrColor.setTo(meanBGR);
        Mat hsvColor = new Mat();
        Imgproc.cvtColor(bgrColor, hsvColor, Imgproc.COLOR_BGR2HSV);
        double[] hsv = hsvColor.get(0, 0); // [H, S, V]
        double hue = hsv[0];
        double sat = hsv[1];
        double val = hsv[2];

        // Classify based on hue range
        if (sat < 50 || val < 50) return new Scalar(128, 128, 128); //gray

        if (hue >= 0 && hue < 10 || hue >= 160 && hue <= 180) return new Scalar(0, 0, 255);     // Red
        if (hue >= 10 && hue < 25) return new Scalar(0, 165, 255);   // Orange
        if (hue >= 25 && hue < 35) return new Scalar(0, 255, 255);   // Yellow
        if (hue >= 35 && hue < 85) return new Scalar(0, 255, 0);     // Green
        if (hue >= 85 && hue < 130) return new Scalar(255, 0, 0);    // Blue
        if (hue >= 130 && hue < 160) return new Scalar(255, 0, 255); // Purple

        return new Scalar(128, 128, 128);
    }

    private static ShapePrediction classifyShape(MatOfPoint contour) {
        MatOfPoint2f contour2f = new MatOfPoint2f(contour.toArray());
        double perimeter = Imgproc.arcLength(contour2f, true);
        double area = Imgproc.contourArea(contour);
        double circularity = 4 * Math.PI * area / (perimeter * perimeter);

        // Approximate the contour to get vertex count
        MatOfPoint2f approx = new MatOfPoint2f();
        Imgproc.approxPolyDP(contour2f, approx, 0.04 * perimeter, true);
        int vertexCount = approx.toArray().length;

        // Convexity defects for star/clover detection
        MatOfInt hull = new MatOfInt();
        Imgproc.convexHull(contour, hull, false);

        int defectCount = 0;
        if(hull.rows() > 3) {
            try {
                MatOfInt4 defects = new MatOfInt4();
                Imgproc.convexityDefects(contour, hull, defects);
                defectCount = defects.rows();
            } catch(CvException e) {

            }
        }

        // Heuristic match scores
        Map<String, Double> scores = new HashMap<>();

        // CIRCLE: high circularity, many vertices, no defects
        if (vertexCount > 8 && circularity > 0.8 && defectCount < 2) {
            scores.put("circle", 0.9 * circularity);
        }

        // STAR4: 8-ish corners, 4 defects
        if (vertexCount >= 8 && defectCount >= 3 && defectCount <= 5) {
            scores.put("star4", 0.8);
        }

        // STAR8: many vertices, many defects
        if (vertexCount >= 12 && defectCount >= 6) {
            scores.put("star8", 0.85);
        }

        // SQUARE: 4 corners, medium circularity
        if (vertexCount == 4 && circularity >= 0.6 && circularity <= 0.8) {
            scores.put("square", 0.8);
        }

        // DIAMOND: 4 corners but more skewed shape
        if (vertexCount == 4 && circularity < 0.6) {
            scores.put("diamond", 0.7);
        }

        // CLOVER: irregular, medium defects, low circularity
        if (vertexCount >= 8 && defectCount >= 4 && circularity < 0.7) {
            scores.put("clover", 0.75);
        }

        // Choose best match
        if (scores.isEmpty()) {
            return new ShapePrediction("unknown", 0.0);
        }

        return scores.entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(entry -> new ShapePrediction(entry.getKey(), entry.getValue()))
                .orElse(new ShapePrediction("unknown", 0.0));
    }

    private static Mat boostColors(Mat image) {
        Mat hsv = new Mat();
        Imgproc.cvtColor(image, hsv, Imgproc.COLOR_BGR2HSV);

        //Split HSV channels
        List<Mat> hsvChannels = new ArrayList<>();
        Core.split(hsv, hsvChannels);
        Mat h = hsvChannels.get(0);
        Mat s = hsvChannels.get(1);
        Mat v = hsvChannels.get(2);

        //Boost Saturation and Brightness
        Core.multiply(s, new Scalar(1.5), s);
        Core.min(s, new Scalar(255), s);
        Core.multiply(v, new Scalar(1.2), v);
        Core.min(v, new Scalar(255), v);

        //merge channels back
        Core.merge(Arrays.asList(h, s, v), hsv);

        //convert back to bgr
        Mat enhanced = new Mat();
        Imgproc.cvtColor(hsv, enhanced, Imgproc.COLOR_HSV2BGR);

        return enhanced;
    }

    private static void saveImage(String name, Mat matrix) {
        if(DEBUG) {
            String path = basePath + "output/" + name + ".jpg";
            Imgcodecs.imwrite(path, matrix);
        }
    }

    private static byte[] loadStaticFile() {
        String path = basePath + "input/qwirkle_1.jpg";
        File file = new File(path);

        try {
            try (FileInputStream fis = new FileInputStream(file)) {
                return fis.readAllBytes();
            }
        } catch (IOException e) {
            return null;
        }
    }
}
