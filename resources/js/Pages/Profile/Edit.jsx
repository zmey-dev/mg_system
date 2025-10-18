import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { useTheme } from '@/contexts/ThemeContext';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const { colors } = useTheme();

    return (
        <MainLayout auth={auth}>
            <Head title="Profile" />

            <div className="py-6 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${colors.text.primary}`}>
                        Perfil
                    </h2>

                    <div className="space-y-6">
                        <div className={`${colors.card} border ${colors.border} rounded-lg p-6 sm:p-8 shadow-sm`}>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>

                        <div className={`${colors.card} border ${colors.border} rounded-lg p-6 sm:p-8 shadow-sm`}>
                            <UpdatePasswordForm />
                        </div>

                        <div className={`${colors.card} border ${colors.border} rounded-lg p-6 sm:p-8 shadow-sm`}>
                            <DeleteUserForm />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
