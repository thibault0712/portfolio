"use client"

import {useEffect, useState} from "react";

const useHeaderIsVisible = () => {
    const [position, setPosition] = useState(0)
    const [visible, setVisible] = useState(true)
    const sensitivity = 150;

    useEffect(()=> {
        const handleScroll = () => {
            const currentScrollY = window.pageYOffset;
            const scrollDelta = currentScrollY - position;

            if (scrollDelta > sensitivity) {
                setVisible(false);
                setPosition(currentScrollY);
            } else if (scrollDelta < -sensitivity) {
                setVisible(true);
                setPosition(currentScrollY);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return(() => {
            window.removeEventListener("scroll", handleScroll);
        })
    })

    return visible;
}

export default useHeaderIsVisible;