import QuizStudent from './QuizStudent';
import QuizTeacher from './QuizTeacher';
import { useAuth } from '@src/context/AuthProvider';
import PageLayout from '@src/components/layout/PageLayout';

export default function Quiz() {
  const { auth } = useAuth();
  return (
    <PageLayout>
      <main className="grow max-w-7xl w-full mx-auto p-10 2xl:pl-0">
        {auth?.user?.role === 'teacher' ? <QuizTeacher /> : <QuizStudent />}
      </main>
    </PageLayout>
  );
}