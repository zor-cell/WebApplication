package net.zorphy.backend.config.property;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "file-storage")
public class FileStorageProperty {
    /**
     * The directory for the file storage where all files are stored
     */
    private String directory;

    /**
     * The percentage of compression applied when saving to .webp format.
     * Eg: 30
     */
    private Integer compressionRate = 40;

    public String getDirectory() {
        return directory;
    }

    public void setDirectory(String directory) {
        this.directory = directory;
    }

    public Integer getCompressionRate() {
        return compressionRate;
    }

    public void setCompressionRate(Integer compressionRate) {
        this.compressionRate = compressionRate;
    }
}
