import { Button } from "@/components/ui/button";
import { themes, type Theme } from "@/lib/themes";
import { Check } from "lucide-react";

interface ThemeStepProps {
  selectedTheme: string;
  setSelectedTheme: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function ThemeStep({
  selectedTheme,
  setSelectedTheme,
  onContinue,
  onBack,
}: ThemeStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-[#2C3947] tracking-tight">
          Choose your theme
        </h2>
        <p className="text-sm text-[#2C3947]/70 font-semibold max-w-sm mx-auto">
          Select a template style to personalize your link page. You can customize this anytime.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto py-2">
        {themes.map((theme: Theme) => {
          const isSelected = selectedTheme === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`group relative text-left p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between h-36 ${
                isSelected
                  ? "border-[#2C3947] shadow-[4px_4px_0px_0px_rgba(44,57,71,1)] -translate-y-1"
                  : "border-[#2C3947]/30 hover:border-[#2C3947] hover:shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] hover:-translate-y-0.5"
              }`}
              style={{
                background: theme.previewBg,
              }}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-[#2C3947] text-[#FEF9C3] p-1 rounded-full border border-[#2C3947] shadow-sm z-10">
                  <Check className="h-3 w-3" />
                </div>
              )}

              {/* Demo button element inside the grid card */}
              <div className="w-full space-y-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                <div 
                  className="h-6 w-full rounded flex items-center justify-center text-[10px] font-bold shadow-sm"
                  style={{
                    backgroundColor: theme.previewButtonBg,
                    color: theme.id === "minimal-dark" || theme.id === "default" ? "#fff" : "#000",
                  }}
                >
                  Link
                </div>
                <div 
                  className="h-6 w-full rounded flex items-center justify-center text-[10px] font-bold shadow-sm"
                  style={{
                    backgroundColor: theme.previewButtonBg,
                    color: theme.id === "minimal-dark" || theme.id === "default" ? "#fff" : "#000",
                  }}
                >
                  Link
                </div>
              </div>

              {/* Theme description footer */}
              <div className="mt-auto pt-2">
                <span 
                  className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-lg shadow-sm border border-[#2C3947] ${
                    theme.id === "default" || theme.id === "clay-retro"
                      ? "bg-[#2C3947] text-[#FEF9C3]" 
                      : "bg-white text-[#2C3947]"
                  }`}
                >
                  {theme.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="px-8 border-2 border-[#2C3947] font-bold text-[#2C3947] rounded-xl hover:bg-slate-50 transition-all h-11"
        >
          Back
        </Button>
        <Button
          onClick={onContinue}
          className="bg-[#2C3947] text-[#FEF9C3] hover:bg-[#212B36] font-bold border-2 border-[#2C3947] h-11 px-8 rounded-xl shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] hover:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
