export interface ProjectMetadata {
    name: string,
    createdAt: Date,
    githubUrl: string | null,
    hasWebsite: boolean,
    isFavorite: boolean
}

export interface ProjectDetails {
    metadata: ProjectMetadata,
    content: string
}