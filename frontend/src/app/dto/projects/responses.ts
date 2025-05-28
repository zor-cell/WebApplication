export interface ProjectMetadata {
    name: string,
    createdAt: Date,
    websiteUrl: string | null,
    githubUrl: string | null
}

export interface ProjectDetails {
    metadata: ProjectMetadata,
    content: string
}