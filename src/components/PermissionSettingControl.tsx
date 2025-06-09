import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider"; // Shadcn Slider

interface PermissionSettingControlProps {
  permissionId: string;
  label: string;
  type: 'toggle' | 'role' | 'limit';
  currentValue: boolean | string | number; // boolean for toggle, string for role, number for limit
  options?: { value: string; label: string }[]; // For role type
  limitRange?: [number, number]; // For limit type [min, max]
  onChange: (value: boolean | string | number) => void;
  activeColor?: string; // e.g., Bright Cyan #00A8E1
}

const PermissionSettingControl: React.FC<PermissionSettingControlProps> = ({
  permissionId,
  label,
  type,
  currentValue,
  options,
  limitRange,
  onChange,
  activeColor = "hsl(var(--primary))", // Default to primary, can be overridden
}) => {
  console.log("Rendering PermissionSettingControl for:", label, "Type:", type);

  // Tailwind doesn't directly support dynamic hex colors in classes like bg-[#00A8E1] without JIT compilation tweaks for arbitrary values.
  // For switches or radio buttons, shadcn often uses data attributes for styling states.
  // We can pass style props for specific elements if needed, or use CSS variables.
  // For the Bright Cyan (#00A8E1), it might be better defined in tailwind.config.js if used widely.
  // For now, I'll use CSS variable approach for switch thumb or use primary.
  // The user journey mentions Bright Cyan (#00A8E1) for active selections.

  return (
    <div className="space-y-2 py-2">
      <Label htmlFor={permissionId} className="font-medium">{label}</Label>
      {type === 'toggle' && (
        <div className="flex items-center space-x-2">
          <Switch
            id={permissionId}
            checked={currentValue as boolean}
            onCheckedChange={(checked) => onChange(checked)}
            // style={{ '--switch-thumb-active-bg': activeColor } as React.CSSProperties}
            // className="data-[state=checked]:bg-[var(--switch-thumb-active-bg)]" // Custom styling for active
          />
          <Label htmlFor={permissionId} className="text-sm text-muted-foreground">
            {currentValue ? "Enabled" : "Disabled"}
          </Label>
        </div>
      )}
      {type === 'role' && options && (
        <RadioGroup
          id={permissionId}
          value={currentValue as string}
          onValueChange={(value) => onChange(value)}
          className="space-y-1"
        >
          {options.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`${permissionId}-${option.value}`} />
              <Label htmlFor={`${permissionId}-${option.value}`} className="font-normal">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
      {type === 'limit' && typeof currentValue === 'number' && limitRange && (
         <div>
            <Slider
                id={permissionId}
                min={limitRange[0]}
                max={limitRange[1]}
                step={1} // Or make configurable
                value={[currentValue]}
                onValueChange={(value) => onChange(value[0])}
                className="py-2"
            />
            <p className="text-sm text-muted-foreground text-right">
                Current Limit: ${currentValue.toLocaleString()}
            </p>
         </div>
      )}
    </div>
  );
};

export default PermissionSettingControl;