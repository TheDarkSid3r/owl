window.addEventListener("load", () => {
    const wrapper = document.querySelector(".wrapper");

    const Sheet = class {
        constructor(h, n) {
            this.element = document.createElement("div");
            this.element.className = "sheet";
            this.element.style.backgroundImage = `url(costume/${h}${n}.jpg)`;
        }

        settings(x, c) {
            return {
                left: `${x * 100}%`,
                duration: 0.4,
                ease: "power2.out",
                onComplete: c
            };
        }

        from(x, c) {
            this.tween = gsap.from(this.element, this.settings(x, c));
            return this;
        }

        to(x, c) {
            this.tween = gsap.to(this.element, this.settings(x, c));
            return this;
        }

        destroy() {
            this.element.remove();
        }
    };

    const Half = class {
        constructor(n, e) {
            this.name = n;
            this.element = e;
        }

        sheet(n) {
            const sheet = new Sheet(this.name, n);
            this.element.append(sheet.element);
            return sheet;
        }

        init(n) {
            this.current = this.sheet(n);
        }

        to(n, o) {
            const next = this.sheet(n).from(1 * o);
            const current = this.current.to(-1 * o, () => current.destroy());
            this.current = next;
        }
    };

    const Page = class {
        constructor(n, e) {
            this.element = e;
            this.half = new Half(n, this.element.querySelector(".half"));

            this.set = Page.createSet();
            this.current = 0;
            this.half.init(this.page);

            this.arrow("left", 1);
            this.arrow("right", -1);
        }

        static createSet() {
            const set = new Array(32).fill(false);
            for (let i = 0; i < 32; i++) {
                const possible = set.map((e, i) => [e, i]).filter(e => e[0] === false).map(e => e[1]);
                const index = possible[Math.floor(Math.random() * possible.length)];
                set[index] = i;
            }
            return set;
        }

        get page() {
            return this.set[this.current];
        }

        navigate(o) {
            const next = this.current + o;
            this.current = next < 0 ? this.set.length - 1 : next >= this.set.length ? 0 : next;
            this.half.to(this.page, o);
            Book.update();
        }

        arrow(n, o) {
            this.element.querySelector(`.arrow.${n}`).addEventListener("click", () => this.navigate(o));
        }
    };

    const Book = new class {
        constructor() {
            this.element = wrapper.querySelector(".book");
            this.pages = [this.page("top"), this.page("bottom")];
            this.update();

            this.resize();
            window.addEventListener("resize", this.resize.bind(this));
        }

        page(n) {
            return new Page(n, this.element.querySelector(`.page.${n}`));
        }

        update() {
            const match = this.pages.every(e => e.page === this.pages[0].page);
            wrapper.querySelector(".sparkle").classList[match ? "add" : "remove"]("active");
        }

        resize() {
            wrapper.querySelector(".circle").style.transform = `translate(-50%, -50%) scale(${Math.min(1, window.innerWidth / 400, window.innerHeight / 350)})`;
        }
    };
});