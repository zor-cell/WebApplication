package net.zorphy.backend.main.service;

import net.zorphy.backend.config.property.FileStorageProperty;
import net.zorphy.backend.main.exception.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {
    private static final Logger logger = LoggerFactory.getLogger(FileStorageServiceImpl.class);

    private final Path fileStorageLocation;

    public FileStorageServiceImpl(FileStorageProperty fileStorageProperty) throws IOException {
        this.fileStorageLocation = Paths.get(fileStorageProperty.getUploadDirectory()).toAbsolutePath().normalize();
        Files.createDirectories(this.fileStorageLocation);
        logger.info("File storage location initialized to: {}", this.fileStorageLocation.toString()); // Add this line

        Path testFilePath = this.fileStorageLocation.resolve("hello.html");
        boolean exists = Files.exists(testFilePath);
        boolean isReadable = Files.isReadable(testFilePath);
        logger.info("Checking file at {}: Exists = {}, Is Readable = {}", testFilePath, exists, isReadable);

    }


    @Override
    public String saveFile(MultipartFile file) {
        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        try {
            // Check if the file's name contains invalid characters
            if (originalFilename.contains("..")) {
                throw new NotFoundException("Sorry! Filename contains invalid path sequence " + originalFilename);
            }

            // Generate a unique filename to prevent overwriting
            String fileExtension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
                fileExtension = originalFilename.substring(dotIndex);
            }
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // Resolve the target path
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return uniqueFilename; // Return the unique filename saved
        } catch (IOException ex) {
            throw new NotFoundException("Could not store file " + originalFilename + ". Please try again!");
        }
    }
}
