export function scrollToRepeatedHomeAnchor(
    event: { preventDefault: () => void },
    href: string
) {
    if (typeof window === "undefined") {
        return;
    }

    const destination = new URL(href, window.location.href);
    if (
        window.location.pathname !== "/" ||
        destination.pathname !== "/" ||
        !destination.hash ||
        destination.hash !== window.location.hash
    ) {
        return;
    }

    const targetId = decodeURIComponent(destination.hash.slice(1));
    const target = document.getElementById(targetId);
    if (!target) {
        return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
}
