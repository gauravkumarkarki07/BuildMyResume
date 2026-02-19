import type { TemplateProps } from "../ResumePreview";

export function ExecutiveTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, workExperiences, educations, skills, projects, certifications } = data;

  return (
    <div className="flex min-h-[1123px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Sidebar */}
      <div className="w-[240px] shrink-0 bg-[#1e293b] p-6 text-white">
        {/* Name */}
        <div className="mb-6 border-b border-white/20 pb-4">
          <h1 className="text-xl font-bold leading-tight">
            {personalInfo.fullName || "Your Name"}
          </h1>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Contact</h2>
          <div className="space-y-1.5 text-xs text-[#cbd5e1]">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
            {personalInfo.github && <p>{personalInfo.github}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Skills</h2>
            <div className="space-y-1">
              {skills.map((skill) => (
                <p key={skill.id} className="text-xs text-[#cbd5e1]">{skill.name}</p>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Certifications</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <p className="text-xs font-semibold text-[#e2e8f0]">{cert.name}</p>
                <p className="text-[10px] text-[#94a3b8]">{cert.issuer} — {cert.issueDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Summary */}
        {summary && (
          <div className="mb-6">
            <h2 className="mb-2 border-l-[3px] border-[#0d9488] pl-3 text-sm font-bold uppercase tracking-wide text-[#1e293b]">
              Summary
            </h2>
            <p className="text-sm leading-relaxed text-[#475569]">{summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {workExperiences.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 border-l-[3px] border-[#0d9488] pl-3 text-sm font-bold uppercase tracking-wide text-[#1e293b]">
              Experience
            </h2>
            {workExperiences.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#1e293b]">{exp.title}</h3>
                    <p className="text-xs text-[#64748b]">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                  </div>
                  <span className="shrink-0 text-xs text-[#94a3b8]">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-[#475569]">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 border-l-[3px] border-[#0d9488] pl-3 text-sm font-bold uppercase tracking-wide text-[#1e293b]">
              Education
            </h2>
            {educations.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#1e293b]">
                      {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    </h3>
                    <p className="text-xs text-[#64748b]">{edu.institution}{edu.location ? `, ${edu.location}` : ""}</p>
                  </div>
                  <span className="shrink-0 text-xs text-[#94a3b8]">
                    {edu.startDate} — {edu.current ? "Present" : edu.endDate}
                  </span>
                </div>
                {edu.gpa && <p className="text-xs text-[#64748b]">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 border-l-[3px] border-[#0d9488] pl-3 text-sm font-bold uppercase tracking-wide text-[#1e293b]">
              Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <h3 className="text-sm font-bold text-[#1e293b]">{proj.name}</h3>
                {proj.description && <p className="text-xs leading-relaxed text-[#475569]">{proj.description}</p>}
                {proj.url && <p className="mt-0.5 text-xs text-[#0d9488]">{proj.url}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
