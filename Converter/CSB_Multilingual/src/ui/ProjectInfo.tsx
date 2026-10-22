import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faGraduationCap, faUserGraduate } from '@fortawesome/free-solid-svg-icons';

export function ProjectInfo({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return <div className="project-info">
    <button className="info-trigger" data-tooltip="Project information" aria-label="Project information" aria-expanded={open} title="Project information" onClick={onToggle}><FontAwesomeIcon icon={faCircleInfo} /></button>
    {open && <aside className="info-popover" aria-label="Project credits">
      <div className="info-popover-title"><FontAwesomeIcon icon={faGraduationCap} /><div><span>ACADEMIC PROJECT</span><b>CSB Multilingual Lexical Analyzer</b></div></div>
      <dl><div><dt>Creator</dt><dd>A.P.N.K. Abeysekara</dd></div><div><dt>Department</dt><dd>Department of Computer Science</dd></div><div><dt>Institution</dt><dd>University of Ruhuna</dd></div><div><dt>Course</dt><dd>CSC 4212 · Compilers and Theory of Computations</dd></div><div><dt>Supervision</dt><dd>Dr. K.D.C.G Kapugama</dd></div></dl>
      <p><FontAwesomeIcon icon={faUserGraduate} /> Rule-based academic demonstration · Offline-first</p>
    </aside>}
  </div>;
}
