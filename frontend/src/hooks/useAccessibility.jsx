import { useEffect } from "react";

export const useKeyboardNavigation = () => {
    useEffect(() =>{
        let isUsingKeyboard = false;

        //detectar teclado
        const handleKeyDown =(e) => {
            if (e.key === "Tab" || e.key === "Enter" || e.keu === "" || e.key.starysWith("Arrow")) {
                isUsingKeyboard = true;
                document.body.classList.add("keyboard-navigation");
                document.body.classList.remove("mouse-navigation");
            }
        }

        //detectar mouse
        const handleMouseDown = () => {
            isUsingKeyboard = false;
            document.body.classList.add("mouse-navigation");
            document.body.classList.remove("keyboard-navigation");
        }

        //detectar foco via teclado
        const handleFocus = (e) => {
            if (isUsingKeyboard) {
                e.target.classList.add("keyboard-focus");
            }
        }

        //remover classe ao perder o foco
        const handleBlur = (e) => {
            e.target.classList.remove("keyboard-focus");
        }

        //addicionar eventos
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("focus", handleFocus);
        document.addEventListener("blur", handleBlur, true);

        //iniciar navegação com mouse
        document.body.classList.add("mouse-navigation");

        //clean up
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("focus", handleFocus);
            document.removeEventListener("blur", handleBlur, true);
            document.body.classList.remove("mouse-navigation");
            document.body.classList.remove("keyboard-navigation");
        }
    }, []);
}


export const useFocusManagement = () => {
    const focusElement = (selector) => {
        const element = document.querySelector(selector);
        if (element) {
            element.focus();
        }
    }

    const focusFirstInteractiveElement = (container) => {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
    
    const trapFocus = (container) => {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e) => {
            if (e.key === "Tab") {
                if (e.shiftKey) { 
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else { 
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        }

        container.addEventListener("keydown", handleTabKey);
        return () => {
            container.removeEventListener("keydown", handleTabKey);
        }
    }

    return {
        focusElement,
        focusFirstInteractiveElement,
        trapFocus,
    }
}

export const useScreenReaderAnnouncements = () => {
    const announce = (message, priority = "polite") => {
        const announcement = document.createElement("div");
        announcement.setAttribute("aria-live", priority);
        announcement.setAttribute("aria-atomic", true);
        announcement.className = "sr-only"; 
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);    
        }, 1000); // Remove depois de 1 segundo  
    }

    return {
        announce,
    }
}