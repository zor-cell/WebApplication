export interface ProjectMetadata {
    name: string,
    createdAt: Date,
    description: string,
    imagePath: string | null,
    githubUrl: string | null,
    hasWebsite: boolean,
    isFavorite: boolean
}

export interface ProjectDetails {
    metadata: ProjectMetadata,
    content: string
}