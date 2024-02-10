// ?? ----------------------------------------
// ?? INIT AND SETUP
// ?? ----------------------------------------

// GSAP
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

document.addEventListener("touchstart", e => {
    if (scrollTween) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }
}, {capture: true, passive: false})

// Smooth scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});

function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
};

requestAnimationFrame(raf)

// Refresh GSAP scroll
ScrollTrigger.refresh();

// Log viewport for dev
var viewportHeight = window.innerHeight;
var viewportWidth = window.innerWidth;
console.log("Viewport height: " + viewportHeight, "Viewport width: " + viewportWidth);

window.addEventListener("resize", () => {
    viewportHeight = window.innerHeight;
    viewportWidth = window.innerWidth;
});

// Scroll to top on load
// gsap.to(window, {
//     duration: 1,
//     scrollTo: 0,
//     ease: "power3.out"
// });

// ?? ----------------------------------------
// ?? HELPER FUNCTIONS
// ?? ----------------------------------------

// Infinite horizontal looping
/*
This helper function makes a group of elements animate along the x-axis in a seamless, responsive loop.

Features:
- Uses xPercent so that even if the widths change (like if the window gets resized), it should still work in most cases.
- When each item animates to the left or right enough, it will loop back to the other side
- Optionally pass in a config object with values like "speed" (default: 1, which travels at roughly 100 pixels per second), paused (boolean),  repeat, reversed, and paddingRight.
- The returned timeline will have the following methods added to it:
- next() - animates to the next element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
- previous() - animates to the previous element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
- toIndex() - pass in a zero-based index value of the element that it should animate to, and optionally pass in a vars object to control duration, easing, etc. Always goes in the shortest direction
- current() - returns the current index (if an animation is in-progress, it reflects the final index)
- times - an Array of the times on the timeline where each element hits the "starting" spot. There's also a label added accordingly, so "label1" is when the 2nd element reaches the start.
*/
function horizontalLoop(items, config) {
    items = gsap.utils.toArray(items);
    config = config || {};
    let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        xPercents = [],
        curIndex = 0,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
        totalWidth, curX, distanceToStart, distanceToLoop, item, i;
    gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
        xPercent: (i, el) => {
            let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
            xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
            return xPercents[i];
        }
    });
    gsap.set(items, {x: 0});
    totalWidth = items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0);
    for (i = 0; i < length; i++) {
        item = items[i];
        curX = xPercents[i] / 100 * widths[i];
        distanceToStart = item.offsetLeft + curX - startX;
        distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
        tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
        .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
        .add("label" + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
    }
    function toIndex(index, vars) {
        vars = vars || {};
        (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
        let newIndex = gsap.utils.wrap(0, length, index),
            time = times[newIndex];
        if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
            vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
            time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        curIndex = newIndex;
        vars.overwrite = true;
        return tl.tweenTo(time, vars);
    }
    tl.next = vars => toIndex(curIndex+1, vars);
    tl.previous = vars => toIndex(curIndex-1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.times = times;
tl.progress(1, true).progress(0, true); // pre-render for performance
if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
}
    return tl;
}

// * ---- Get total scroll ----

let global_scrollProgress = 0;

ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    // Scroll progress function
    onUpdate: (self) => {
        global_scrollProgress = Math.round(self.progress  * 100);
    }
});

// * ---- / ----

// * ---- Delay links -----

var pageChangeHref = '';

function goToLink() {

    gsap.delayedCall(0.25, function() {
        document.location.href = pageChangeHref;
    });
};

// * ---- / ----

// Get cursor position
function getCursor(e) {
    var rect = e.target.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}

// ?? ----------------------------------------
// ?? GLOBAL
// ?? ----------------------------------------

// * ---- Progress bar ----

gsap.to("#scroll-progress", {
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
    },
    height: "100%"
});

// * ---- / ----

// * ---- Scroll to section ----

function scrollToSection(section) {
    gsap.to(window, {
        duration: 1.5,
        scrollTo: section,
        ease: "power2.inOut"
    });
};

// * ---- / ----

// ** ----------------------------------------
// ** BACGKROUNDS AND OVERLAY
// ** ----------------------------------------

// * ---- Background blob gradient ----

/*
*   Stripe WebGl Gradient Animation
*   All Credits to Stripe.com
*   ScrollObserver functionality to disable animation when not scrolled into view has been disabled and 
*   commented out for now.
*   https://kevinhufnagl.com
*/
//Converting colors to proper format
function normalizeColor(hexCode) {
    return [(hexCode >> 16 & 255) / 255, (hexCode >> 8 & 255) / 255, (255 & hexCode) / 255]
} ["SCREEN", "LINEAR_LIGHT"].reduce((hexCode, t, n) => Object.assign(hexCode, {
    [t]: n
}), {});

//Essential functionality of WebGl
//t = width
//n = height
class MiniGl {
    constructor(canvas, width, height, debug = false) {
        const _miniGl = this,
            debug_output = -1 !== document.location.search.toLowerCase().indexOf("debug=webgl");
        _miniGl.canvas = canvas, _miniGl.gl = _miniGl.canvas.getContext("webgl", {
            antialias: true
        }), _miniGl.meshes = [];
        const context = _miniGl.gl;
        width && height && this.setSize(width, height), _miniGl.lastDebugMsg, _miniGl.debug = debug && debug_output ? function (e) {
            const t = new Date;
            t - _miniGl.lastDebugMsg > 1e3 && console.log("---"), console.log(t.toLocaleTimeString() + Array(Math.max(0, 32 - e.length)).join(" ") + e + ": ", ...Array.from(arguments).slice(1)), _miniGl.lastDebugMsg = t
        } : () => { }, Object.defineProperties(_miniGl, {
            Material: {
                enumerable: false,
                value: class {
                    constructor(vertexShaders, fragments, uniforms = {}) {
                        const material = this;
                        function getShaderByType(type, source) {
                            const shader = context.createShader(type);
                            return context.shaderSource(shader, source), context.compileShader(shader), context.getShaderParameter(shader, context.COMPILE_STATUS) || console.error(context.getShaderInfoLog(shader)), _miniGl.debug("Material.compileShaderSource", {
                                source: source
                            }), shader
                        }
                        function getUniformVariableDeclarations(uniforms, type) {
                            return Object.entries(uniforms).map(([uniform, value]) => value.getDeclaration(uniform, type)).join("\n")
                        }
                        material.uniforms = uniforms, material.uniformInstances = [];

                        const prefix = "\n              precision highp float;\n            ";
                        material.vertexSource = `\n              ${prefix}\n              attribute vec4 position;\n              attribute vec2 uv;\n              attribute vec2 uvNorm;\n              ${getUniformVariableDeclarations(_miniGl.commonUniforms, "vertex")}\n              ${getUniformVariableDeclarations(uniforms, "vertex")}\n              ${vertexShaders}\n            `,
                            material.Source = `\n              ${prefix}\n              ${getUniformVariableDeclarations(_miniGl.commonUniforms, "fragment")}\n              ${getUniformVariableDeclarations(uniforms, "fragment")}\n              ${fragments}\n            `,
                            material.vertexShader = getShaderByType(context.VERTEX_SHADER, material.vertexSource),
                            material.fragmentShader = getShaderByType(context.FRAGMENT_SHADER, material.Source),
                            material.program = context.createProgram(),
                            context.attachShader(material.program, material.vertexShader),
                            context.attachShader(material.program, material.fragmentShader),
                            context.linkProgram(material.program),
                            context.getProgramParameter(material.program, context.LINK_STATUS) || console.error(context.getProgramInfoLog(material.program)),
                            context.useProgram(material.program),
                            material.attachUniforms(void 0, _miniGl.commonUniforms),
                            material.attachUniforms(void 0, material.uniforms)
                    }
                    //t = uniform
                    attachUniforms(name, uniforms) {
                        //n  = material
                        const material = this;
                        void 0 === name ? Object.entries(uniforms).forEach(([name, uniform]) => {
                            material.attachUniforms(name, uniform)
                        }) : "array" == uniforms.type ? uniforms.value.forEach((uniform, i) => material.attachUniforms(`${name}[${i}]`, uniform)) : "struct" == uniforms.type ? Object.entries(uniforms.value).forEach(([uniform, i]) => material.attachUniforms(`${name}.${uniform}`, i)) : (_miniGl.debug("Material.attachUniforms", {
                            name: name,
                            uniform: uniforms
                        }), material.uniformInstances.push({
                            uniform: uniforms,
                            location: context.getUniformLocation(material.program, name)
                        }))
                    }
                }
            },
            Uniform: {
                enumerable: !1,
                value: class {
                    constructor(e) {
                        this.type = "float", Object.assign(this, e);
                        this.typeFn = {
                            float: "1f",
                            int: "1i",
                            vec2: "2fv",
                            vec3: "3fv",
                            vec4: "4fv",
                            mat4: "Matrix4fv"
                        }[this.type] || "1f", this.update()
                    }
                    update(value) {
                        void 0 !== this.value && context[`uniform${this.typeFn}`](value, 0 === this.typeFn.indexOf("Matrix") ? this.transpose : this.value, 0 === this.typeFn.indexOf("Matrix") ? this.value : null)
                    }
                    //e - name
                    //t - type
                    //n - length
                    getDeclaration(name, type, length) {
                        const uniform = this;
                        if (uniform.excludeFrom !== type) {
                            if ("array" === uniform.type) return uniform.value[0].getDeclaration(name, type, uniform.value.length) + `\nconst int ${name}_length = ${uniform.value.length};`;
                            if ("struct" === uniform.type) {
                                let name_no_prefix = name.replace("u_", "");
                                return name_no_prefix =
                                    name_no_prefix.charAt(0).toUpperCase() +
                                    name_no_prefix.slice(1),
                                    `uniform struct ${name_no_prefix} 
                                {\n` +
                                    Object.entries(uniform.value).map(([name, uniform]) =>
                                        uniform.getDeclaration(name, type)
                                            .replace(/^uniform/, ""))
                                        .join("")
                                    + `\n} ${name}${length > 0 ? `[${length}]` : ""};`
                            }
                            return `uniform ${uniform.type} ${name}${length > 0 ? `[${length}]` : ""};`
                        }
                    }
                }
            },
            PlaneGeometry: {
                enumerable: !1,
                value: class {
                    constructor(width, height, n, i, orientation) {
                        context.createBuffer(), this.attributes = {
                            position: new _miniGl.Attribute({
                                target: context.ARRAY_BUFFER,
                                size: 3
                            }),
                            uv: new _miniGl.Attribute({
                                target: context.ARRAY_BUFFER,
                                size: 2
                            }),
                            uvNorm: new _miniGl.Attribute({
                                target: context.ARRAY_BUFFER,
                                size: 2
                            }),
                            index: new _miniGl.Attribute({
                                target: context.ELEMENT_ARRAY_BUFFER,
                                size: 3,
                                type: context.UNSIGNED_SHORT
                            })
                        }, this.setTopology(n, i), this.setSize(width, height, orientation)
                    }
                    setTopology(e = 1, t = 1) {
                        const n = this;
                        n.xSegCount = e, n.ySegCount = t, n.vertexCount = (n.xSegCount + 1) * (n.ySegCount + 1), n.quadCount = n.xSegCount * n.ySegCount * 2, n.attributes.uv.values = new Float32Array(2 * n.vertexCount), n.attributes.uvNorm.values = new Float32Array(2 * n.vertexCount), n.attributes.index.values = new Uint16Array(3 * n.quadCount);
                        for (let e = 0; e <= n.ySegCount; e++)
                            for (let t = 0; t <= n.xSegCount; t++) {
                                const i = e * (n.xSegCount + 1) + t;
                                if (n.attributes.uv.values[2 * i] = t / n.xSegCount, n.attributes.uv.values[2 * i + 1] = 1 - e / n.ySegCount, n.attributes.uvNorm.values[2 * i] = t / n.xSegCount * 2 - 1, n.attributes.uvNorm.values[2 * i + 1] = 1 - e / n.ySegCount * 2, t < n.xSegCount && e < n.ySegCount) {
                                    const s = e * n.xSegCount + t;
                                    n.attributes.index.values[6 * s] = i, n.attributes.index.values[6 * s + 1] = i + 1 + n.xSegCount, n.attributes.index.values[6 * s + 2] = i + 1, n.attributes.index.values[6 * s + 3] = i + 1, n.attributes.index.values[6 * s + 4] = i + 1 + n.xSegCount, n.attributes.index.values[6 * s + 5] = i + 2 + n.xSegCount
                                }
                            }
                        n.attributes.uv.update(), n.attributes.uvNorm.update(), n.attributes.index.update(), _miniGl.debug("Geometry.setTopology", {
                            uv: n.attributes.uv,
                            uvNorm: n.attributes.uvNorm,
                            index: n.attributes.index
                        })
                    }
                    setSize(width = 1, height = 1, orientation = "xz") {
                        const geometry = this;
                        geometry.width = width,
                            geometry.height = height,
                            geometry.orientation = orientation,
                            geometry.attributes.position.values && geometry.attributes.position.values.length === 3 * geometry.vertexCount
                            || (geometry.attributes.position.values = new Float32Array(3 * geometry.vertexCount));
                        const o = width / -2,
                            r = height / -2,
                            segment_width = width / geometry.xSegCount,
                            segment_height = height / geometry.ySegCount;
                        for (let yIndex = 0; yIndex <= geometry.ySegCount; yIndex++) {
                            const t = r + yIndex * segment_height;
                            for (let xIndex = 0; xIndex <= geometry.xSegCount; xIndex++) {
                                const r = o + xIndex * segment_width,
                                    l = yIndex * (geometry.xSegCount + 1) + xIndex;
                                geometry.attributes.position.values[3 * l + "xyz".indexOf(orientation[0])] = r,
                                    geometry.attributes.position.values[3 * l + "xyz".indexOf(orientation[1])] = -t
                            }
                        }
                        geometry.attributes.position.update(), _miniGl.debug("Geometry.setSize", {
                            position: geometry.attributes.position
                        })
                    }
                }
            },
            Mesh: {
                enumerable: !1,
                value: class {
                    constructor(geometry, material) {
                        const mesh = this;
                        mesh.geometry = geometry, mesh.material = material, mesh.wireframe = !1, mesh.attributeInstances = [], Object.entries(mesh.geometry.attributes).forEach(([e, attribute]) => {
                            mesh.attributeInstances.push({
                                attribute: attribute,
                                location: attribute.attach(e, mesh.material.program)
                            })
                        }), _miniGl.meshes.push(mesh), _miniGl.debug("Mesh.constructor", {
                            mesh: mesh
                        })
                    }
                    draw() {
                        context.useProgram(this.material.program), this.material.uniformInstances.forEach(({
                            uniform: e,
                            location: t
                        }) => e.update(t)), this.attributeInstances.forEach(({
                            attribute: e,
                            location: t
                        }) => e.use(t)), context.drawElements(this.wireframe ? context.LINES : context.TRIANGLES, this.geometry.attributes.index.values.length, context.UNSIGNED_SHORT, 0)
                    }
                    remove() {
                        _miniGl.meshes = _miniGl.meshes.filter(e => e != this)
                    }
                }
            },
            Attribute: {
                enumerable: !1,
                value: class {
                    constructor(e) {
                        this.type = context.FLOAT, this.normalized = !1, this.buffer = context.createBuffer(), Object.assign(this, e), this.update()
                    }
                    update() {
                        void 0 !== this.values && (context.bindBuffer(this.target, this.buffer), context.bufferData(this.target, this.values, context.STATIC_DRAW))
                    }
                    attach(e, t) {
                        const n = context.getAttribLocation(t, e);
                        return this.target === context.ARRAY_BUFFER && (context.enableVertexAttribArray(n), context.vertexAttribPointer(n, this.size, this.type, this.normalized, 0, 0)), n
                    }
                    use(e) {
                        context.bindBuffer(this.target, this.buffer), this.target === context.ARRAY_BUFFER && (context.enableVertexAttribArray(e), context.vertexAttribPointer(e, this.size, this.type, this.normalized, 0, 0))
                    }
                }
            }
        });
        const a = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        _miniGl.commonUniforms = {
            projectionMatrix: new _miniGl.Uniform({
                type: "mat4",
                value: a
            }),
            modelViewMatrix: new _miniGl.Uniform({
                type: "mat4",
                value: a
            }),
            resolution: new _miniGl.Uniform({
                type: "vec2",
                value: [1, 1]
            }),
            aspectRatio: new _miniGl.Uniform({
                type: "float",
                value: 1
            })
        }
    }
    setSize(e = 640, t = 480) {
        this.width = e, this.height = t, this.canvas.width = e, this.canvas.height = t, this.gl.viewport(0, 0, e, t), this.commonUniforms.resolution.value = [e, t], this.commonUniforms.aspectRatio.value = e / t, this.debug("MiniGL.setSize", {
            width: e,
            height: t
        })
    }
    //left, right, top, bottom, near, far
    setOrthographicCamera(e = 0, t = 0, n = 0, i = -2e3, s = 2e3) {
        this.commonUniforms.projectionMatrix.value = [2 / this.width, 0, 0, 0, 0, 2 / this.height, 0, 0, 0, 0, 2 / (i - s), 0, e, t, n, 1], this.debug("setOrthographicCamera", this.commonUniforms.projectionMatrix.value)
    }
    render() {
        this.gl.clearColor(0, 0, 0, 0), this.gl.clearDepth(1), this.meshes.forEach(e => e.draw())
    }
}

//Sets initial properties
function e(object, propertyName, val) {
    return propertyName in object ? Object.defineProperty(object, propertyName, {
        value: val,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : object[propertyName] = val, object
}

//Gradient object
class Gradient {
    constructor(...t) {
        e(this, "el", void 0), e(this, "cssVarRetries", 0), e(this, "maxCssVarRetries", 200), e(this, "angle", 0), e(this, "isLoadedClass", !1), e(this, "isScrolling", !1), /*e(this, "isStatic", o.disableAmbientAnimations()),*/ e(this, "scrollingTimeout", void 0), e(this, "scrollingRefreshDelay", 200), e(this, "isIntersecting", !1), e(this, "shaderFiles", void 0), e(this, "vertexShader", void 0), e(this, "sectionColors", void 0), e(this, "computedCanvasStyle", void 0), e(this, "conf", void 0), e(this, "uniforms", void 0), e(this, "t", 1253106), e(this, "last", 0), e(this, "width", void 0), e(this, "minWidth", 1111), e(this, "height", 600), e(this, "xSegCount", void 0), e(this, "ySegCount", void 0), e(this, "mesh", void 0), e(this, "material", void 0), e(this, "geometry", void 0), e(this, "minigl", void 0), e(this, "scrollObserver", void 0), e(this, "amp", 320), e(this, "seed", 5), e(this, "freqX", 14e-5), e(this, "freqY", 29e-5), e(this, "freqDelta", 1e-5), e(this, "activeColors", [1, 1, 1, 1]), e(this, "isMetaKey", !1), e(this, "isGradientLegendVisible", !1), e(this, "isMouseDown", !1), e(this, "handleScroll", () => {
            clearTimeout(this.scrollingTimeout), this.scrollingTimeout = setTimeout(this.handleScrollEnd, this.scrollingRefreshDelay), this.isGradientLegendVisible && this.hideGradientLegend(), this.conf.playing && (this.isScrolling = !0, this.pause())
        }), e(this, "handleScrollEnd", () => {
            this.isScrolling = !1, this.isIntersecting && this.play()
        }), e(this, "resize", () => {
            this.width = window.innerWidth, this.minigl.setSize(this.width, this.height), this.minigl.setOrthographicCamera(), this.xSegCount = Math.ceil(this.width * this.conf.density[0]), this.ySegCount = Math.ceil(this.height * this.conf.density[1]), this.mesh.geometry.setTopology(this.xSegCount, this.ySegCount), this.mesh.geometry.setSize(this.width, this.height), this.mesh.material.uniforms.u_shadow_power.value = this.width < 600 ? 5 : 6
        }), e(this, "handleMouseDown", e => {
            this.isGradientLegendVisible && (this.isMetaKey = e.metaKey, this.isMouseDown = !0, !1 === this.conf.playing && requestAnimationFrame(this.animate))
        }), e(this, "handleMouseUp", () => {
            this.isMouseDown = !1
        }), e(this, "animate", e => {
            if (!this.shouldSkipFrame(e) || this.isMouseDown) {
                if (this.t += Math.min(e - this.last, 1e3 / 15), this.last = e, this.isMouseDown) {
                    let e = 160;
                    this.isMetaKey && (e = -160), this.t += e
                }
                this.mesh.material.uniforms.u_time.value = this.t, this.minigl.render()

            }
            if (0 !== this.last && this.isStatic) return this.minigl.render(), void this.disconnect();
            (/*this.isIntersecting && */this.conf.playing || this.isMouseDown) && requestAnimationFrame(this.animate)
        }), e(this, "addIsLoadedClass", () => {
          /*this.isIntersecting && */!this.isLoadedClass && (this.isLoadedClass = !0, this.el.classList.add("isLoaded"), setTimeout(() => {
            this.el.parentElement.classList.add("isLoaded")
        }, 3e3))
        }), e(this, "pause", () => {
            this.conf.playing = false
        }), e(this, "play", () => {
            requestAnimationFrame(this.animate), this.conf.playing = true
        }), e(this, "initGradient", (selector) => {
            this.el = document.querySelector(selector);
            this.connect();
            return this;
        })
    }
    async connect() {
        this.shaderFiles = {
            vertex: "varying vec3 v_color;\n\nvoid main() {\n  float time = u_time * u_global.noiseSpeed;\n\n  vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;\n\n  vec2 st = 1. - uvNorm.xy;\n\n  //\n  // Tilting the plane\n  //\n\n  // Front-to-back tilt\n  float tilt = resolution.y / 2.0 * uvNorm.y;\n\n  // Left-to-right angle\n  float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;\n\n  // Up-down shift to offset incline\n  float offset = resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);\n\n  //\n  // Vertex noise\n  //\n\n  float noise = snoise(vec3(\n    noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,\n    noiseCoord.y * u_vertDeform.noiseFreq.y,\n    time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed\n  )) * u_vertDeform.noiseAmp;\n\n  // Fade noise to zero at edges\n  noise *= 1.0 - pow(abs(uvNorm.y), 2.0);\n\n  // Clamp to 0\n  noise = max(0.0, noise);\n\n  vec3 pos = vec3(\n    position.x,\n    position.y + tilt + incline + noise - offset,\n    position.z\n  );\n\n  //\n  // Vertex color, to be passed to fragment shader\n  //\n\n  if (u_active_colors[0] == 1.) {\n    v_color = u_baseColor;\n  }\n\n  for (int i = 0; i < u_waveLayers_length; i++) {\n    if (u_active_colors[i + 1] == 1.) {\n      WaveLayers layer = u_waveLayers[i];\n\n      float noise = smoothstep(\n        layer.noiseFloor,\n        layer.noiseCeil,\n        snoise(vec3(\n          noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,\n          noiseCoord.y * layer.noiseFreq.y,\n          time * layer.noiseSpeed + layer.noiseSeed\n        )) / 2.0 + 0.5\n      );\n\n      v_color = blendNormal(v_color, layer.color, pow(noise, 4.));\n    }\n  }\n\n  //\n  // Finish\n  //\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\n}",
            noise: "//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//               https://github.com/stegu/webgl-noise\n//\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n    return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise(vec3 v)\n{\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n// Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n// Permutations\n  i = mod289(i);\n  vec4 p = permute( permute( permute(\n            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n// Gradients: 7x7 points over a square, mapped onto an octahedron.\n// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n}",
            blend: "//\n// https://github.com/jamieowen/glsl-blend\n//\n\n// Normal\n\nvec3 blendNormal(vec3 base, vec3 blend) {\n\treturn blend;\n}\n\nvec3 blendNormal(vec3 base, vec3 blend, float opacity) {\n\treturn (blendNormal(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Screen\n\nfloat blendScreen(float base, float blend) {\n\treturn 1.0-((1.0-base)*(1.0-blend));\n}\n\nvec3 blendScreen(vec3 base, vec3 blend) {\n\treturn vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));\n}\n\nvec3 blendScreen(vec3 base, vec3 blend, float opacity) {\n\treturn (blendScreen(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Multiply\n\nvec3 blendMultiply(vec3 base, vec3 blend) {\n\treturn base*blend;\n}\n\nvec3 blendMultiply(vec3 base, vec3 blend, float opacity) {\n\treturn (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Overlay\n\nfloat blendOverlay(float base, float blend) {\n\treturn base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));\n}\n\nvec3 blendOverlay(vec3 base, vec3 blend) {\n\treturn vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));\n}\n\nvec3 blendOverlay(vec3 base, vec3 blend, float opacity) {\n\treturn (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Hard light\n\nvec3 blendHardLight(vec3 base, vec3 blend) {\n\treturn blendOverlay(blend,base);\n}\n\nvec3 blendHardLight(vec3 base, vec3 blend, float opacity) {\n\treturn (blendHardLight(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Soft light\n\nfloat blendSoftLight(float base, float blend) {\n\treturn (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));\n}\n\nvec3 blendSoftLight(vec3 base, vec3 blend) {\n\treturn vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));\n}\n\nvec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {\n\treturn (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Color dodge\n\nfloat blendColorDodge(float base, float blend) {\n\treturn (blend==1.0)?blend:min(base/(1.0-blend),1.0);\n}\n\nvec3 blendColorDodge(vec3 base, vec3 blend) {\n\treturn vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));\n}\n\nvec3 blendColorDodge(vec3 base, vec3 blend, float opacity) {\n\treturn (blendColorDodge(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Color burn\n\nfloat blendColorBurn(float base, float blend) {\n\treturn (blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0);\n}\n\nvec3 blendColorBurn(vec3 base, vec3 blend) {\n\treturn vec3(blendColorBurn(base.r,blend.r),blendColorBurn(base.g,blend.g),blendColorBurn(base.b,blend.b));\n}\n\nvec3 blendColorBurn(vec3 base, vec3 blend, float opacity) {\n\treturn (blendColorBurn(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Vivid Light\n\nfloat blendVividLight(float base, float blend) {\n\treturn (blend<0.5)?blendColorBurn(base,(2.0*blend)):blendColorDodge(base,(2.0*(blend-0.5)));\n}\n\nvec3 blendVividLight(vec3 base, vec3 blend) {\n\treturn vec3(blendVividLight(base.r,blend.r),blendVividLight(base.g,blend.g),blendVividLight(base.b,blend.b));\n}\n\nvec3 blendVividLight(vec3 base, vec3 blend, float opacity) {\n\treturn (blendVividLight(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Lighten\n\nfloat blendLighten(float base, float blend) {\n\treturn max(blend,base);\n}\n\nvec3 blendLighten(vec3 base, vec3 blend) {\n\treturn vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));\n}\n\nvec3 blendLighten(vec3 base, vec3 blend, float opacity) {\n\treturn (blendLighten(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Linear burn\n\nfloat blendLinearBurn(float base, float blend) {\n\t// Note : Same implementation as BlendSubtractf\n\treturn max(base+blend-1.0,0.0);\n}\n\nvec3 blendLinearBurn(vec3 base, vec3 blend) {\n\t// Note : Same implementation as BlendSubtract\n\treturn max(base+blend-vec3(1.0),vec3(0.0));\n}\n\nvec3 blendLinearBurn(vec3 base, vec3 blend, float opacity) {\n\treturn (blendLinearBurn(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Linear dodge\n\nfloat blendLinearDodge(float base, float blend) {\n\t// Note : Same implementation as BlendAddf\n\treturn min(base+blend,1.0);\n}\n\nvec3 blendLinearDodge(vec3 base, vec3 blend) {\n\t// Note : Same implementation as BlendAdd\n\treturn min(base+blend,vec3(1.0));\n}\n\nvec3 blendLinearDodge(vec3 base, vec3 blend, float opacity) {\n\treturn (blendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Linear light\n\nfloat blendLinearLight(float base, float blend) {\n\treturn blend<0.5?blendLinearBurn(base,(2.0*blend)):blendLinearDodge(base,(2.0*(blend-0.5)));\n}\n\nvec3 blendLinearLight(vec3 base, vec3 blend) {\n\treturn vec3(blendLinearLight(base.r,blend.r),blendLinearLight(base.g,blend.g),blendLinearLight(base.b,blend.b));\n}\n\nvec3 blendLinearLight(vec3 base, vec3 blend, float opacity) {\n\treturn (blendLinearLight(base, blend) * opacity + base * (1.0 - opacity));\n}",
            fragment: "varying vec3 v_color;\n\nvoid main() {\n  vec3 color = v_color;\n  if (u_darken_top == 1.0) {\n    vec2 st = gl_FragCoord.xy/resolution.xy;\n    color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;\n  }\n  gl_FragColor = vec4(color, 1.0);\n}"
        },
            this.conf = {
                presetName: "",
                wireframe: false,
                density: [.06, .16],
                zoom: 1,
                rotation: 0,
                playing: true
            },
            document.querySelectorAll("canvas").length < 1 ? console.log("DID NOT LOAD HERO STRIPE CANVAS") : (

                this.minigl = new MiniGl(this.el, null, null, !0),
                requestAnimationFrame(() => {
                    this.el && (this.computedCanvasStyle = getComputedStyle(this.el), this.waitForCssVars())
                })
                /*
                this.scrollObserver = await s.create(.1, !1),
                this.scrollObserver.observe(this.el),
                this.scrollObserver.onSeparate(() => {
                    window.removeEventListener("scroll", this.handleScroll), window.removeEventListener("mousedown", this.handleMouseDown), window.removeEventListener("mouseup", this.handleMouseUp), window.removeEventListener("keydown", this.handleKeyDown), this.isIntersecting = !1, this.conf.playing && this.pause()
                }), 
                this.scrollObserver.onIntersect(() => {
                    window.addEventListener("scroll", this.handleScroll), window.addEventListener("mousedown", this.handleMouseDown), window.addEventListener("mouseup", this.handleMouseUp), window.addEventListener("keydown", this.handleKeyDown), this.isIntersecting = !0, this.addIsLoadedClass(), this.play()
                })*/

            )
    }
    disconnect() {
        this.scrollObserver && (window.removeEventListener("scroll", this.handleScroll), window.removeEventListener("mousedown", this.handleMouseDown), window.removeEventListener("mouseup", this.handleMouseUp), window.removeEventListener("keydown", this.handleKeyDown), this.scrollObserver.disconnect()), window.removeEventListener("resize", this.resize)
    }
    initMaterial() {
        this.uniforms = {
            u_time: new this.minigl.Uniform({
                value: 0
            }),
            u_shadow_power: new this.minigl.Uniform({
                value: 5
            }),
            u_darken_top: new this.minigl.Uniform({
                value: "" === this.el.dataset.jsDarkenTop ? 1 : 0
            }),
            u_active_colors: new this.minigl.Uniform({
                value: this.activeColors,
                type: "vec4"
            }),
            u_global: new this.minigl.Uniform({
                value: {
                    noiseFreq: new this.minigl.Uniform({
                        value: [this.freqX, this.freqY],
                        type: "vec2"
                    }),
                    noiseSpeed: new this.minigl.Uniform({
                        value: 5e-6
                    })
                },
                type: "struct"
            }),
            u_vertDeform: new this.minigl.Uniform({
                value: {
                    incline: new this.minigl.Uniform({
                        value: Math.sin(this.angle) / Math.cos(this.angle)
                    }),
                    offsetTop: new this.minigl.Uniform({
                        value: -.5
                    }),
                    offsetBottom: new this.minigl.Uniform({
                        value: -.5
                    }),
                    noiseFreq: new this.minigl.Uniform({
                        value: [3, 4],
                        type: "vec2"
                    }),
                    noiseAmp: new this.minigl.Uniform({
                        value: this.amp
                    }),
                    noiseSpeed: new this.minigl.Uniform({
                        value: 10
                    }),
                    noiseFlow: new this.minigl.Uniform({
                        value: 3
                    }),
                    noiseSeed: new this.minigl.Uniform({
                        value: this.seed
                    })
                },
                type: "struct",
                excludeFrom: "fragment"
            }),
            u_baseColor: new this.minigl.Uniform({
                value: this.sectionColors[0],
                type: "vec3",
                excludeFrom: "fragment"
            }),
            u_waveLayers: new this.minigl.Uniform({
                value: [],
                excludeFrom: "fragment",
                type: "array"
            })
        };
        for (let e = 1; e < this.sectionColors.length; e += 1) this.uniforms.u_waveLayers.value.push(new this.minigl.Uniform({
            value: {
                color: new this.minigl.Uniform({
                    value: this.sectionColors[e],
                    type: "vec3"
                }),
                noiseFreq: new this.minigl.Uniform({
                    value: [2 + e / this.sectionColors.length, 3 + e / this.sectionColors.length],
                    type: "vec2"
                }),
                noiseSpeed: new this.minigl.Uniform({
                    value: 11 + .3 * e
                }),
                noiseFlow: new this.minigl.Uniform({
                    value: 6.5 + .3 * e
                }),
                noiseSeed: new this.minigl.Uniform({
                    value: this.seed + 10 * e
                }),
                noiseFloor: new this.minigl.Uniform({
                    value: .1
                }),
                noiseCeil: new this.minigl.Uniform({
                    value: .63 + .07 * e
                })
            },
            type: "struct"
        }));
        return this.vertexShader = [this.shaderFiles.noise, this.shaderFiles.blend, this.shaderFiles.vertex].join("\n\n"), new this.minigl.Material(this.vertexShader, this.shaderFiles.fragment, this.uniforms)
    }
    initMesh() {
        this.material = this.initMaterial(), this.geometry = new this.minigl.PlaneGeometry, this.mesh = new this.minigl.Mesh(this.geometry, this.material)
    }
    shouldSkipFrame(e) {
        return !!window.document.hidden || (!this.conf.playing || (parseInt(e, 10) % 2 == 0 || void 0))
    }
    updateFrequency(e) {
        this.freqX += e, this.freqY += e
    }
    toggleColor(index) {
        this.activeColors[index] = 0 === this.activeColors[index] ? 1 : 0
    }
    showGradientLegend() {
        this.width > this.minWidth && (this.isGradientLegendVisible = !0, document.body.classList.add("isGradientLegendVisible"))
    }
    hideGradientLegend() {
        this.isGradientLegendVisible = !1, document.body.classList.remove("isGradientLegendVisible")
    }
    init() {
        this.initGradientColors(), this.initMesh(), this.resize(), requestAnimationFrame(this.animate), window.addEventListener("resize", this.resize)
    }
    /*
    * Waiting for the css variables to become available, usually on page load before we can continue.
    * Using default colors assigned below if no variables have been found after maxCssVarRetries
    */
    waitForCssVars() {
        if (this.computedCanvasStyle && -1 !== this.computedCanvasStyle.getPropertyValue("--gradient-color-1").indexOf("#")) this.init(), this.addIsLoadedClass();
        else {
            if (this.cssVarRetries += 1, this.cssVarRetries > this.maxCssVarRetries) {
                return this.sectionColors = [16711680, 16711680, 16711935, 65280, 255], void this.init();
            }
            requestAnimationFrame(() => this.waitForCssVars())
        }
    }
    /*
    * Initializes the four section colors by retrieving them from css variables.
    */
    initGradientColors() {
        this.sectionColors = ["--gradient-color-1", "--gradient-color-2", "--gradient-color-3", "--gradient-color-4"].map(cssPropertyName => {
            let hex = this.computedCanvasStyle.getPropertyValue(cssPropertyName).trim();
            //Check if shorthand hex value was used and double the length so the conversion in normalizeColor will work.
            if (4 === hex.length) {
                const hexTemp = hex.substr(1).split("").map(hexTemp => hexTemp + hexTemp).join("");
                hex = `#${hexTemp}`
            }
            return hex && `0x${hex.substr(1)}`
        }).filter(Boolean).map(normalizeColor)
    }
}

/*
*Finally initializing the Gradient class, assigning a canvas to it and calling Gradient.connect() which initializes everything,
* Use Gradient.pause() and Gradient.play() for controls.
*
* Here are some default property values you can change anytime:
* Amplitude:    Gradient.amp = 0
* Colors:       Gradient.sectionColors (if you change colors, use normalizeColor(#hexValue)) before you assign it.
*
*
* Useful functions
* Gradient.toggleColor(index)
* Gradient.updateFrequency(freq)
*/

// Create your instance
const gradient = new Gradient()

// Call `initGradient` with the selector to your canvas
gradient.initGradient('#gradient-canvas')

// * ---- / ----

// ** ----------------------------------------
// ** CURSOR
// ** ----------------------------------------

const cursor = document.querySelector('.__cursor');
const cursorBall = document.getElementsByClassName('__cursor-ball')[0];

document.body.addEventListener('mousemove', cursorMove);

// Track cursor movement
function cursorMove(e) {

    let tl = gsap.timeline({
    });

    let cursorX = e.clientX;
    let cursorY = e.clientY;

    tl.to(cursor, {
        x: cursorX,
        y: cursorY,
        ease: "power2"
    });

    localStorage.setItem("cursorX", cursorX);
    localStorage.setItem("cursorY", cursorY);
}

// Curosr hover
let cursorHover_tl = gsap.timeline({
    paused: true
});

cursorHover_tl.to(cursorBall, {
    fill: "rgba(255,200,87,0)",
    stroke: "rgba(255,200,87,1)",
}).to(cursorBall, {
    scale: 2.64,
    ease: "power3.inOut"
}, "<");

$('.--cursor-hover').on('mouseenter', function(){
    cursorHover_tl.play();
}).on('mouseleave', function(){
    cursorHover_tl.reverse();
});

// Cursor expand
let cursorExpand_tl = gsap.timeline({
    paused: true
});

cursorExpand_tl.to(cursorBall, {
    scale: 2.30
});

$('.--cursor-expand').on('mouseenter', function(){
    cursorExpand_tl.play();
}).on('mouseleave', function(){
    cursorExpand_tl.reverse();
});

// ?? ----------------------------------------
// ?? EFFECTS
// ?? ----------------------------------------

// ** ----------------------------------------
// ** TEXT
// ** ----------------------------------------

// Text reveal animation
let textRevealArr = gsap.utils.toArray(".--text-reveal");

textRevealArr.forEach(el => {
    let el_tl = gsap.timeline({
        scrollTrigger: {
            trigger: el,
            start: "-25% 50%",
            end: "80% 70%",
            scrub: 1.2
        }
    });

    charArr = Array.from($(el).text()).map(char => {
        let charSpan = document.createElement('span');
        $(charSpan).text(char)
        return charSpan;
    });

    $(el).text('');

    charArr.forEach(newSpan => el.appendChild(newSpan));

    charArr.forEach(item => {
        el_tl.to(item, {
            onComplete: () => item.classList.add("--text-revealed"),
            onReverseComplete: () => item.classList.remove("--text-revealed")
        })
    })
});

// Text expand
let expandWordArr = gsap.utils.toArray(".--text-expand");

expandWordArr.forEach(el => {
    let el_tl = gsap.timeline({
        scrollTrigger: {
            trigger: el,
            start: "-150% center",
            end: "150% center",
            toggleActions: "play none reverse none",
            scrub: 1.32,
        }
    });

    charArr = Array.from($(el).text()).map(char => {
        let charSpan = document.createElement('span');
        $(charSpan).text(char)
        return charSpan;
    });

    $(el).text('');

    charArr.forEach(newSpan => el.appendChild(newSpan));

    charArr.forEach(item => {
        el_tl.to(item, {
            duration: 0.25,
            paddingRight: "0.312rem",
            ease: "ease.inOut"
        }, "<10%")
    })
})

// Text flicker
let textFlickerArr = gsap.utils.toArray(".--text-flicker-container");

textFlickerArr.forEach(container => {

    let elementSelector = gsap.utils.selector(container);

    let tl = gsap.timeline({
        paused: true
    });

    gsap.utils.toArray(elementSelector(".--text-flicker")).forEach(el => {
        // ? Maybe add in a separate, duplicate timeline that you can toggle elsewhere?

        charArr = Array.from($(el).text()).map(char => {
            let charSpan = document.createElement('span');
            $(charSpan).text(char)
            return charSpan;
        });

        $(el).text('');

        charArr.forEach(newSpan => el.appendChild(newSpan));

        charArr.forEach(item => {
            let randomTime = gsap.utils.random(0, 0.25);

            tl.to(item, {
                duration: 0.5,
                keyframes: {
                    "0%": {opacity: 0},
                    "40%": {opacity: 0.5},
                    "70%": {opacity: 0},
                    "100%": {opacity: 1}
                }
            }, randomTime)
        })

        $(container).hover(function() {
            tl.restart();
        }, function() {
            tl.restart();
        });
    })
});

// ** ----------------------------------------
// ** BLINK
// ** ----------------------------------------

// Regular blink
gsap.utils.toArray('.--blink').forEach(elem => {
    let blink_anim = gsap.to(elem, {
        duration: 2,
        repeat: -1,
        yoyo: true,
        keyframes: {
            "0%": {opacity: "50%"},
            "25%": {opacity: "100%"},
            easeEach: "power2.inOut"
        }
    });

    $(elem).hover(function() {
        blink_anim.pause();
    }, function() {
        blink_anim.play();
    });
})

// Faster blink
gsap.utils.toArray(".--blink-fast").forEach(item => {
    gsap.to(item, {
        duration: 0.75,
        repeat: -1,
        yoyo: true,
        opacity: 1,
        ease: "expo.inOut"
    })
})

// ** ----------------------------------------
// ** FLICKER
// ** ----------------------------------------

let flickerContainer = gsap.utils.toArray(".--flicker-container");

// Random flicker fade in
flickerContainer.forEach(flickerContainer => {

    let containerElement = gsap.utils.selector(flickerContainer);

    // Flicker timeline
    let randomFlicker_tl = gsap.timeline({
        scrollTrigger: {
            trigger: flickerContainer,
            start: "top 75%",
        }
    });

    let elementsArr = gsap.utils.toArray(containerElement(".--flicker-element"));
    let adjustedTiming = gsap.utils.mapRange(0, 100, 0, 10, elementsArr.length);

    elementsArr.forEach(flickerItem => {
        let tl = gsap.timeline();
        gsap.set(flickerItem, {
            opacity: 0
        })
        tl.to(flickerItem, {
            duration: 0.4 + adjustedTiming,
            delay: () => gsap.utils.random(0,(adjustedTiming / 10) - 0.05),
            keyframes: {
                "0%": {opacity: "0%"},
                "50%": {opacity: "75%"},
                "75%": {opacity: "40%"},
                "100%": {opacity: 1},
                ease: "power1.inOut"
            },
        });
        randomFlicker_tl.add(tl, gsap.utils.random(0,1))
    })
});

// ** ----------------------------------------
// ** DELAY LINK
// ** ----------------------------------------

$(".--delay-link").on("click", (e) => {
    e.preventDefault();
});

// ** ----------------------------------------
// ** IMAGES
// ** ----------------------------------------

// ?? ----------------------------------------
// ?? INTERACTIVE
// ?? ----------------------------------------

// ** ----------------------------------------
// ** NAVIGATION
// ** ----------------------------------------

const headerMenuIcon = $('.header-menu-w');
const headerMenuIconSVG = $('.svg_menu-icon');

const expandedMenuContainer = $(".expanded-menu-c");

const menuContainer = $(".menu-c");

const menuSelectionContainer = $(".menu-selection-c");
const menuSelection = $(".menu-selection");

const menuBackgroundContainer = document.getElementsByClassName("expanded-menu-background-c");
const menuBackgroundBarsArr = gsap.utils.toArray(".menu-background-bar");

// Menu icon hover animation
let menuHover_tl = gsap.timeline({
    defaults: {
        duration: 0.5
    },
    paused: true
});

menuHover_tl.to('#menu-line_1', {
    xPercent: -50
}).to('#menu-line_2', {
    xPercent: 50
}, '<');

headerMenuIcon.hover(function() {
    menuHover_tl.play()
}, function() {
    menuHover_tl.reverse()
});

// Position menu off screen to start
gsap.set(menuContainer, {
    xPercent: 120
})

// Current selected element for selection hover change animation
let currentPage = "";
if (window.location.href.match(/[\w-]+(?=\.html)/g)) {
    currentPage = currentLoc.match(/[\w-]+(?=\.html)/g).toString().replaceAll("-", " ").toUpperCase();
} else {
    currentPage = "HOME";
}

let currentSelected = currentPage;

// Parent timeline for menu animation
let expandedMenu_tl = gsap.timeline({
    paused: true,
    onReverseComplete: () => $(expandedMenuContainer).toggleClass("-inactive")
}).add(menuBackground_anim()).add(menuSelection_anim(), "<75%").add(menuContent_anim(), "<")

// Background animation
function menuBackground_anim() {
    let tl = gsap.timeline({
        onComplete: () => $(body).toggleClass("-lockScroll")
    });

    tl.set(".expanded-menu-background-c", {
        visibility: "visible"
    });

    menuBackgroundBarsArr.forEach(item => {
        tl.to(item, {
            scaleY: "100%",
            ease: "cubic-bezier(1.000, 0.000, 0.000, 1.000)"
        }, '<50%')
    })

    return tl
};

// Main menu slide in animation
function menuContent_anim() {
    tl = gsap.timeline();

    tl.to(menuContainer, {
        xPercent: 0,
        ease: "power2.out"
    });

    return tl
};

// Menu slection container animation
function menuSelection_anim(selection) {

    let tl = gsap.timeline();

    tl.set(menuSelection, {
        text: ""
    });

    tl.to(menuSelectionContainer, {
        opacity: 1,
        ease: "sine.inOut"
    }).to(menuSelection, {
        duration: 1,
        text: currentSelected
    });

    if (selection) {
        tl.restart();
    };

    return tl;
};

// Menu click event listener
headerMenuIcon.on("click", function() {
    $(expandedMenuContainer).toggleClass("-inactive");

    // Menu selection change animation
    function changeMenuSelection(e) {
        let selected = e.target;

        if (selected.dataset.pageName && (selected.dataset.pageName != currentSelected)) {
            currentSelected = selected.dataset.pageName;
            
            gsap.to(menuSelection, {
                duration: 0.5,
                text: "",
                onComplete: () => menuSelection_anim()
            })
        };
    }

    // Call the selection animation whenever a menu link is hovered
    $(".menu-page-link-wrapper").on("mouseenter", (e) => {
        changeMenuSelection(e);
    });

    expandedMenu_tl.timeScale(1).play()
});

// Close menu
$(".menu-close-w, .menu-selection-c").on("click", function(e) {
    expandedMenu_tl.timeScale(1.5).reverse()
})

// ** ----------------------------------------
// ** ICONS AND SYMBOLS
// ** ----------------------------------------

// * ---- Arrows ----

// Diagonal small hover
let arrowDiagonalSmallContainerArr = gsap.utils.toArray(".--arrow-c");

arrowDiagonalSmallContainerArr.forEach(container => {
    let containerHover_tl = gsap.timeline({
        paused: true,
    });
    let thisContainer = gsap.utils.selector(container);

    containerHover_tl.set(thisContainer(".__arrow_diagonal_small"), {
        x: 0,
        y: 0
    }).to(thisContainer(".__arrow_diagonal_small"), {
        xPercent: 120,
        yPercent: -120
    }).set(thisContainer(".__arrow_diagonal_small"), {
        xPercent: -240,
        yPercent: 250
    }).to(thisContainer(".__arrow_diagonal_small"), {
        xPercent: 0,
        yPercent: 0
    });

    $(container).hover(function(){
        containerHover_tl.restart();
    }, function(){
        containerHover_tl.restart();
    });
})

// Vertical hover
let arrowVerticalContainerArr = gsap.utils.toArray(".--arrow-vertical-c");

arrowVerticalContainerArr.forEach(container => {
    let thisContainer = gsap.utils.selector(container);
    if (thisContainer(".__arrow_up_medium")) {
        let arrow = thisContainer(".__arrow_up_medium");

        let containerHover_tl = gsap.timeline({
            paused: true,
            ease: "power2.inOut"
        });
    
        containerHover_tl.set(arrow, {
            x: 0,
            y: 0
        }).to(arrow, {
            yPercent: -150
        }).set(arrow, {
            yPercent: 250
        }).to(arrow, {
            yPercent: 0
        });
    
        $(container).on("mouseenter", function() {
            containerHover_tl.restart();
        });
    } 
    if (thisContainer(".__arrow_down_medium")) {
        let arrow = thisContainer(".__arrow_down_medium");

        let containerHover_tl = gsap.timeline({
            paused: true,
            ease: "power2.inOut"
        });
    
        containerHover_tl.set(arrow, {
            x: 0,
            y: 0
        }).to(arrow, {
            yPercent: 150
        }).set(arrow, {
            yPercent: -250
        }).to(arrow, {
            yPercent: 0
        });
    
        $(container).on("mouseenter", function() {
            containerHover_tl.restart();
        });
    }
})

// * ---- / ----

// Menu email copy icon click feedback
let copyIconSVG = gsap.utils.selector(".menu-contact-copy-button");

$(".menu-contact-copy-button").on("click", function() {
    gsap.to(copyIconSVG("path"), {
        duration: 0.25,
        repeat: 1,
        repeatDelay: 0.75,
        yoyo: true,
        fill: "#57FF74"
    })
})

// ?? ----------------------------------------
// ?? TESTING ZONE
// ?? ----------------------------------------

const r = new rive.Rive({
    src: "assets/rive/under-dev.riv",
    canvas: document.getElementById("canvas"),
    autoplay: true,
    stateMachines: "State-machine__under-dev",
    onLoad: () => {
        r.resizeDrawingSurfaceToCanvas();
    },
});