import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  CSSDimension,
  SUPPORTED_KEYS,
  SplitterProps,
  getPosition,
  setStyles,
  shiftX,
  shiftY,
} from "./Splitter.library";
import "./Splitter.scss";

let dragOwner: string | null = null;

const Splitter = ({
  orientation,
  children,
  minSize = "20%",
  initialPosition = "50%",
}: SplitterProps) => {
  const id = useId();
  const splitter = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const panelA = useRef<HTMLDivElement>(null);
  const panelB = useRef<HTMLDivElement>(null);

  const setPosition = (newPos: CSSDimension) => {
    if (panelA.current && panelB.current) {
      setStyles(panelA.current, panelB.current, orientation, newPos, minSize);
    }
  };

  useEffect(() => {
    if (!splitter.current || !handle.current) {
      return;
    }

    const handleDragStart = (e: DragEvent) => {
      if (dragOwner) {
        return;
      }
      if (e.target !== handle.current) {
        return;
      }
      if (!e.dataTransfer || !splitter.current) {
        return;
      }

      e.stopPropagation();
      e.dataTransfer?.setDragImage(splitter.current, -99999, -99999);
      dragOwner = id;

      if (handle.current) {
        handle.current.classList.toggle("dragging");
      }
    };

    const handleDragEnd = (e: DragEvent) => {
      if (!splitter.current) {
        return;
      }
      if (id !== dragOwner) {
        return;
      }

      e.stopPropagation();
      dragOwner = null;

      if (handle.current) {
        handle.current.classList.toggle("dragging");
      }
    };

    const handleDragOver = (e: DragEvent) => {
      if (!splitter.current) {
        return;
      }
      if (id !== dragOwner) {
        return;
      }

      e.stopPropagation();

      const pos = getPosition(e, orientation, splitter.current);
      setPosition(pos);
    };

    /**
     * Key navigation supports some but not all of the recommended accessible key navigations.
     * https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
     */
    const handleKeyPress = (e: KeyboardEvent) => {
      const parent = handle.current?.parentElement;
      if (!parent || !SUPPORTED_KEYS.has(e.key)) {
        return;
      }

      e.stopPropagation();

      const keyNav = `${orientation}.${e.key}`;
      switch (keyNav) {
        case "horizontal.ArrowRight": {
          const pos = shiftX(parent, 5);
          setPosition(pos);
          break;
        }
        case "horizontal.ArrowLeft": {
          const pos = shiftX(parent, -5);
          setPosition(pos);
          break;
        }
        case "vertical.ArrowUp": {
          const pos = shiftY(parent, -5);
          setPosition(pos);
          break;
        }
        case "vertical.ArrowDown": {
          const pos = shiftY(parent, 5);
          setPosition(pos);
          break;
        }
        case "horizontal.Home":
        case "vertical.Home": {
          setPosition(0);
          break;
        }
        case "horizontal.End":
        case "vertical.End": {
          setPosition("100%");
          break;
        }
        case "horizontal.Enter":
        case "vertical.Enter": {
          setPosition(initialPosition);
          break;
        }
        default:
          return;
      }
    };

    setPosition(initialPosition);

    splitter.current.addEventListener("dragstart", handleDragStart);
    splitter.current.addEventListener("dragend", handleDragEnd);
    splitter.current.addEventListener("dragover", handleDragOver);
    handle.current.addEventListener("keydown", handleKeyPress);

    return () => {
      if (!splitter.current || !handle.current) {
        return;
      }

      splitter.current.removeEventListener("dragstart", handleDragStart);
      splitter.current.removeEventListener("dragend", handleDragEnd);
      splitter.current.removeEventListener("dragover", handleDragOver);
      handle.current.removeEventListener("keypress", handleKeyPress);
    };
  }, [initialPosition]);

  return (
    <div className={`split ${orientation}`} ref={splitter}>
      <div className="panel a" ref={panelA}>
        {children[0]}
      </div>

      <div className="separator">
        <div
          className="handle"
          draggable
          tabIndex={0}
          role="separator"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={100} // todo
          ref={handle}
        />
      </div>

      <div className="panel b" ref={panelB}>
        {children[1]}
      </div>
    </div>
  );
};

export { Splitter };
export type { SplitterProps };
