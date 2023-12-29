import { CheckIcon, Cross2Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { useRef, useState } from "react";
import "./ToggleInput.css";

type ToggleInputProps = {
  value: string;
  name: string;
  disabled?: boolean;
  className?: string;
  onSubmit?: (value: string) => void;
};

export default function ToggleInput({
  value,
  name,
  className,
  onSubmit,
  disabled = false,
}: ToggleInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleIsEditingChange = () => {
    const newIsEditing = !isEditing;
    setIsEditing(newIsEditing);
    if (newIsEditing) {
      ref.current?.focus();
    } else if (ref.current) {
      onSubmit?.(ref.current.value);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (ref.current) {
      ref.current.value = value;
    }
  };

  return (
    <div
      className={`toggle-input ${isEditing ? "editing" : ""} ${
        className ?? ""
      }`}
    >
      <fieldset disabled={disabled}>
        <input
          ref={ref}
          name={name}
          type="text"
          defaultValue={value}
          readOnly={!isEditing}
        />
        <label>
          <input
            type="checkbox"
            name={`${name}--isEditing`}
            value="false"
            checked={!isEditing}
            onChange={handleIsEditingChange}
          />
          {isEditing ? <CheckIcon /> : <Pencil1Icon />}
        </label>

        {isEditing ? (
          <button type="reset" onClick={handleCancel}>
            <Cross2Icon />
          </button>
        ) : null}
      </fieldset>
    </div>
  );
}
