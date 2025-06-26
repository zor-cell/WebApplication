package net.zorphy.backend.main.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    private LocalDate createdAt;

    private String title;
    private String description;
    private String filePath;
    private String imagePath;
    private String githubUrl;
    private Boolean hasWebsite;
    private Boolean isFavorite;

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public Boolean getHasWebsite() {
        return hasWebsite;
    }

    public void setHasWebsite(Boolean hasWebsite) {
        this.hasWebsite = hasWebsite;
    }

    public Boolean getIsFavorite() {
        return isFavorite;
    }

    public void setIsFavorite(Boolean favorite) {
        isFavorite = favorite;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Project project)) return false;
        return Objects.equals(id, project.id) && Objects.equals(name, project.name) && Objects.equals(createdAt, project.createdAt) && Objects.equals(filePath, project.filePath) && Objects.equals(githubUrl, project.githubUrl) && Objects.equals(hasWebsite, project.hasWebsite) && Objects.equals(isFavorite, project.isFavorite);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, createdAt, filePath, githubUrl, hasWebsite, isFavorite);
    }
}
