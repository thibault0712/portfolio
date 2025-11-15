
export type PersonalProjectType = {
    $id: string;
    $updatedAt: Date;
    projectName: string;
    description: string;
    startDate: Date;
    endDate: Date;
    codeLink: string | null;
    demoLink: string | null;
    tags: string[];
    documentation: string;
    imageLink: string;
}