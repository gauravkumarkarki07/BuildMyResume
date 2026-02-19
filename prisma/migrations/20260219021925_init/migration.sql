-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Untitled Resume',
    "template" TEXT NOT NULL DEFAULT 'modern',
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalInfo" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "linkedin" TEXT,
    "github" TEXT,
    "website" TEXT,

    CONSTRAINT "PersonalInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "fieldOfStudy" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "gpa" TEXT,
    "description" TEXT,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "url" TEXT,
    "startDate" TEXT,
    "endDate" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issueDate" TEXT NOT NULL,
    "expiryDate" TEXT,
    "certificateUrl" TEXT,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalInfo_resumeId_key" ON "PersonalInfo"("resumeId");

-- CreateIndex
CREATE INDEX "WorkExperience_resumeId_idx" ON "WorkExperience"("resumeId");

-- CreateIndex
CREATE INDEX "Education_resumeId_idx" ON "Education"("resumeId");

-- CreateIndex
CREATE INDEX "Skill_resumeId_idx" ON "Skill"("resumeId");

-- CreateIndex
CREATE INDEX "Project_resumeId_idx" ON "Project"("resumeId");

-- CreateIndex
CREATE INDEX "Certification_resumeId_idx" ON "Certification"("resumeId");

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalInfo" ADD CONSTRAINT "PersonalInfo_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
