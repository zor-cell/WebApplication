package net.zorphy.backend.main.service;

import net.zorphy.backend.config.property.FileStorageProperty;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.exception.FileStorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.Iterator;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {
    private static final Logger logger = LoggerFactory.getLogger(FileStorageServiceImpl.class);

    private final Path fileStorageLocation;

    public FileStorageServiceImpl(FileStorageProperty fileStorageProperty) throws IOException {
        this.fileStorageLocation = Paths.get(fileStorageProperty.getDirectory()).toAbsolutePath().normalize();
        Files.createDirectories(this.fileStorageLocation);

        logger.debug("File storage location initialized to: {}", this.fileStorageLocation);
    }

    @Override
    public String saveFile(GameType gameType, MultipartFile file) {
        if(file == null) return null;

        String relativePath = "games/%s".formatted(gameType.toString().toLowerCase());
        return saveFile(relativePath, file);
    }

    public String saveFileToWebp(String subDirectory, MultipartFile file) {
        if (file == null) return null;

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        try {
            //check for invalid characters
            if (originalFilename.contains("..")) {
                throw new FileStorageException("Filename contains invalid path sequence " + originalFilename);
            }

            //get target directory
            Path subLocation = this.fileStorageLocation.resolve(subDirectory);
            Files.createDirectories(subLocation);

            //save file in .webp format
            String uniqueFilename = LocalDate.now() + "_" + UUID.randomUUID() + ".webp";
            Path targetPath = subLocation.resolve(uniqueFilename);
            this.writeWebP(file, targetPath.toFile(), 0.2f);

            return formatPath(subDirectory, uniqueFilename);
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + originalFilename, ex);
        }
    }

    @Override
    public String saveFile(String subDirectory, MultipartFile file) {
        if (file == null) return null;

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        try {
            //check for invalid characters
            if (originalFilename.contains("..")) {
                throw new FileStorageException("Filename contains invalid path sequence " + originalFilename);
            }

            //generate unique filename
            String fileExtension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
                fileExtension = originalFilename.substring(dotIndex);
            }

            //get target directory
            Path subLocation = this.fileStorageLocation.resolve(subDirectory);
            Files.createDirectories(subLocation);

            //save original file
            String uniqueFilename = LocalDate.now() + "_" + UUID.randomUUID() + fileExtension;
            Path targetLocation = subLocation.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return formatPath(subDirectory, uniqueFilename);
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + originalFilename, ex);
        }
    }

    @Override
    public void deleteFile(String relativePath) {
        if(relativePath == null) {
            return;
        }

        try {
            Path filePath = this.fileStorageLocation.resolve(relativePath).normalize();

            if(Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch(IOException ex) {
            throw new FileStorageException("Could not delete file " + relativePath, ex);
        }
    }

    private String formatPath(String subDirectory, String filename) {
        subDirectory = subDirectory.replaceAll("^/+|/+$", ""); // remove leading/trailing slashes
        filename = filename.replaceAll("^/+", ""); // remove leading slashes

        return subDirectory + "/" + filename;
    }

    private void writeWebP(MultipartFile file, File outputFile, float quality) throws IOException {
        BufferedImage image = ImageIO.read(file.getInputStream());

        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("webp");
        if (!writers.hasNext()) {
            throw new IOException("No WebP ImageWriter found");
        }
        ImageWriter writer = writers.next();

        ImageWriteParam writeParam = writer.getDefaultWriteParam();
        if (writeParam.canWriteCompressed()) {
            writeParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            writeParam.setCompressionType("Lossy");
            writeParam.setCompressionQuality(quality);
        }

        try (ImageOutputStream ios = ImageIO.createImageOutputStream(outputFile)) {
            writer.setOutput(ios);
            writer.write(null, new IIOImage(image, null, null), writeParam);
        } finally {
            writer.dispose();
        }
    }

}
