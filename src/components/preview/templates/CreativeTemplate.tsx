import type { TemplateProps } from "../ResumePreview";

export function CreativeTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, workExperiences, educations, skills, projects, certifications } = data;

  return (
    <div className="p-10 text-[#333]" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div className="mb-2">
        <h1
          className="text-4xl font-bold tracking-tight text-[#1a1a1a]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {personalInfo.fullName || "Your Name"}
        </h1>
        {/* Coral accent bar */}
        <div className="mt-2 h-1 w-16 rounded-full bg-[#e85d3a]" />
      </div>

      {/* Contact row */}
      <div className="mb-8 mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#666]">
        {personalInfo.email && <span>{personalInfo.email}</span>}
        {personalInfo.phone && <span>{personalInfo.phone}</span>}
        {personalInfo.location && <span>{personalInfo.location}</span>}
        {personalInfo.linkedin && <span className="text-[#e85d3a]">{personalInfo.linkedin}</span>}
        {personalInfo.github && <span className="text-[#e85d3a]">{personalInfo.github}</span>}
        {personalInfo.website && <span className="text-[#e85d3a]">{personalInfo.website}</span>}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-8">
          <h2
            className="mb-3 text-lg font-bold text-[#1a1a1a]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            About
          </h2>
          <p className="text-sm leading-relaxed text-[#444]">{summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {workExperiences.length > 0 && (
        <div className="mb-8">
          <h2
            className="mb-4 text-lg font-bold text-[#1a1a1a]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Experience
          </h2>
          {workExperiences.map((exp) => (
            <div key={exp.id} className="mb-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1a1a1a]">{exp.title}</h3>
                  <p className="text-xs font-medium text-[#e85d3a]">{exp.company}{exp.location ? ` — ${exp.location}` : ""}</p>
                </div>
                <span className="shrink-0 text-xs text-[#999]">
                  {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.description && (
                <p className="mt-1.5 whitespace-pre-line text-xs leading-relaxed text-[#444]">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <div className="mb-8">
          <h2
            className="mb-4 text-lg font-bold text-[#1a1a1a]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Education
          </h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1a1a1a]">
                    {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                  </h3>
                  <p className="text-xs font-medium text-[#e85d3a]">{edu.institution}{edu.location ? ` — ${edu.location}` : ""}</p>
                </div>
                <span className="shrink-0 text-xs text-[#999]">
                  {edu.startDate} — {edu.current ? "Present" : edu.endDate}
                </span>
              </div>
              {edu.gpa && <p className="mt-0.5 text-xs text-[#666]">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills as pills */}
      {skills.length > 0 && (
        <div className="mb-8">
          <h2
            className="mb-3 text-lg font-bold text-[#1a1a1a]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full bg-[#f5f0eb] px-3 py-1 text-xs font-medium text-[#555]"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-8">
          <h2
            className="mb-4 text-lg font-bold text-[#1a1a1a]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Projects
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <h3 className="text-sm font-bold text-[#1a1a1a]">{proj.name}</h3>
              {proj.description && <p className="text-xs leading-relaxed text-[#444]">{proj.description}</p>}
              {proj.url && <p className="mt-0.5 text-xs text-[#e85d3a]">{proj.url}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-8">
          <h2
            className="mb-4 text-lg font-bold text-[#1a1a1a]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Certifications
          </h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-3">
              <h3 className="text-sm font-bold text-[#1a1a1a]">{cert.name}</h3>
              <p className="text-xs text-[#666]">{cert.issuer} — {cert.issueDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
