import type { TemplateProps } from "../ResumePreview";

export function ModernTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, workExperiences, educations, skills, projects, certifications } = data;

  return (
    <div className="p-10 text-gray-800" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div className="mb-6 border-b-2 border-blue-600 pb-4">
        <h1 className="text-3xl font-bold text-blue-600">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <div className="mt-1 flex flex-wrap gap-3 text-sm text-blue-600">
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-5">
          <h2 className="mb-2 text-lg font-bold uppercase tracking-wide text-blue-600">Summary</h2>
          <p className="text-sm leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {workExperiences.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3 text-lg font-bold uppercase tracking-wide text-blue-600">Experience</h2>
          {workExperiences.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{exp.title}</h3>
                  <p className="text-sm text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                </div>
                <span className="shrink-0 text-sm text-gray-500">
                  {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.description && (
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3 text-lg font-bold uppercase tracking-wide text-blue-600">Education</h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</h3>
                  <p className="text-sm text-gray-600">{edu.institution}{edu.location ? `, ${edu.location}` : ""}</p>
                </div>
                <span className="shrink-0 text-sm text-gray-500">
                  {edu.startDate} — {edu.current ? "Present" : edu.endDate}
                </span>
              </div>
              {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-2 text-lg font-bold uppercase tracking-wide text-blue-600">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="rounded bg-blue-50 px-2 py-1 text-sm text-blue-700">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3 text-lg font-bold uppercase tracking-wide text-blue-600">Projects</h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <h3 className="font-semibold">{proj.name}</h3>
              {proj.description && <p className="text-sm leading-relaxed">{proj.description}</p>}
              {proj.url && <p className="mt-1 text-xs text-blue-500">{proj.url}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3 text-lg font-bold uppercase tracking-wide text-blue-600">Certifications</h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <h3 className="font-semibold">{cert.name}</h3>
              <p className="text-sm text-gray-600">{cert.issuer} — {cert.issueDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
