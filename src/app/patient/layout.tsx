import { PatientShell } from './components/PatientShell'
import { TimezoneSetter } from './components/TimezoneSetter'

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TimezoneSetter />
      <PatientShell>{children}</PatientShell>
    </>
  )
}
