const r = new rive.Rive({
    src: "assets/rive/under-dev.riv",
    canvas: document.getElementById("canvas"),
    autoplay: true,
    stateMachines: "State-machine__under-dev",
    onLoad: () => {
        r.resizeDrawingSurfaceToCanvas();
    },
});