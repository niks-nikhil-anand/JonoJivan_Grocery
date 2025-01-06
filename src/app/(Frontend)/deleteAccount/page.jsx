import React from 'react';

const DeleteAccountPage = () => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center">Delete Your Account</h1>

      {/* Introduction */}
      <p className="text-gray-700 text-lg">
        We&apos;re sorry to see you go! If you decide to delete your account, please follow the instructions carefully. Keep in mind that this action is permanent and cannot be undone.
      </p>

      {/* Instructions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Steps to Delete Your Account:</h2>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700">
          <li>Log in to your account using your credentials.</li>
          <li>Navigate to the account settings or profile section.</li>
          <li>Locate the &ldquo;Delete Account&ldquo; option and click on it.</li>
          <li>Confirm your choice by following the on-screen instructions.</li>
        </ol>
        <p className="text-red-600 font-medium">
          Note: You must be logged in to delete your account. If you&apos;re not logged in, please do so first.
        </p>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Frequently Asked Questions (FAQs)</h2>
        <div className="space-y-2">
          <div>
            <h3 className="font-medium">Q: Can I recover my account after deletion?</h3>
            <p className="text-gray-600">
              No, once your account is deleted, it cannot be recovered.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Q: Will my data be permanently removed?</h3>
            <p className="text-gray-600">
              Yes, all your data will be permanently deleted and cannot be retrieved.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Q: What happens to my subscriptions after deleting my account?</h3>
            <p className="text-gray-600">
              Any active subscriptions will be automatically canceled once your account is deleted.
            </p>
          </div>
        </div>
      </div>

      {/* Reminder */}
      <p className="text-gray-800 font-medium text-center">
        Please make sure you are logged in before proceeding to delete your account.
      </p>
    </div>
  );
};

export default DeleteAccountPage;
