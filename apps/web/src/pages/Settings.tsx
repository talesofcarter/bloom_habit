import {
  IconUser,
  IconShieldLock,
  IconDatabaseExport,
  IconTrash,
} from "@tabler/icons-react";

export default function Settings() {
  return (
    <div className="max-w-3xl space-y-12 pb-12 animate-in fade-in duration-700">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-extralight tracking-wide text-white mb-2">
          Settings.
        </h1>
        <p className="text-white/50 tracking-wide text-sm">
          Manage your account, privacy, and preferences.
        </p>
      </header>

      {/* Account Settings */}
      <section className="bg-white/2 border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
          <div className="bg-white/5 p-3 rounded-2xl">
            <IconUser className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-medium text-white tracking-wide">
              Account Details
            </h2>
            <p className="text-xs text-white/40 tracking-wide mt-1">
              Update your personal information.
            </p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-semibold tracking-widest text-white/70 uppercase mb-3">
                Preferred Name
              </label>
              <input
                type="text"
                defaultValue="Alex"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-green focus:bg-white/5 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest text-white/70 uppercase mb-3">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="hello@example.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-green focus:bg-white/5 transition-all duration-300"
              />
            </div>
          </div>
          <button className="bg-white/10 hover:bg-white/20 text-white font-bold tracking-widest text-xs uppercase px-8 py-3.5 rounded-full transition-all duration-300 active:scale-[0.98]">
            Save Changes
          </button>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="bg-white/2 border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
          <div className="bg-white/5 p-3 rounded-2xl">
            <IconShieldLock className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-medium text-white tracking-wide">
              Privacy & Data
            </h2>
            <p className="text-xs text-white/40 tracking-wide mt-1">
              Manage your encryption and data footprint.
            </p>
          </div>
        </div>

        <div className="p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-black/40 border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
            <div className="flex flex-col gap-1 mb-4 sm:mb-0">
              <span className="text-sm font-medium text-white">
                Export Journal History
              </span>
              <span className="text-xs text-white/40">
                Download all your check-ins as an encrypted JSON file.
              </span>
            </div>
            <button className="flex items-center gap-2 justify-center px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold tracking-widest uppercase text-white transition-all">
              <IconDatabaseExport size={16} />
              Export
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="border border-red-500/20 bg-red-500/2 rounded-3xl overflow-hidden">
        <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-red-500 tracking-wide">
              Danger Zone
            </span>
            <span className="text-xs text-white/50 leading-relaxed max-w-md">
              Permanently delete your account and all associated recovery data.
              This action cannot be undone.
            </span>
          </div>
          <button className="flex items-center gap-2 justify-center px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-full text-xs font-bold tracking-widest uppercase text-red-500 transition-all shrink-0">
            <IconTrash size={16} />
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}
