package net.zorphy.backend.main.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String saveFile(String subDirectory, MultipartFile file);
}
