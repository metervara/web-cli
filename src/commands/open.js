const openCommand = {
    name: "open",
    description: "Opens a link on the page by matching its text",
    usage: "open <linkText>",
    execute(args) {
        if (args.length === 0) {
            console.error("Usage: open <linkText>");
            return;
        }
        const linkText = args.join(" ");
        // Find an <a> element whose text matches the given linkText
        const link = Array.from(document.querySelectorAll("a")).find(a => { var _a; return ((_a = a.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === linkText; });
        if (!link) {
            console.error(`No link found with text "${linkText}".`);
            return;
        }
        const href = link.getAttribute("href");
        if (!href) {
            console.error(`Link with text "${linkText}" has no valid href.`);
            return;
        }
        // Navigate to the href
        window.location.href = href;
    }
};
export default openCommand;
