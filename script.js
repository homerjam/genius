var loaded = false, finished = false,
    intersection, green, orange, greenPath, orangePath, greenClone, orangeClone,
    greenPos = {
        position: {}
    },
    greenEnd = {
        position: {}
    },
    orangePos = {
        position: {}
    },
    orangeEnd = {
        position: {}
    };

paper._global = {
    greenPos: function(obj) {
        _.merge(greenPos, obj);
    },
    orangePos: orangePos
};

project.importSVG('green.svg', {
    onLoad: function(item) {
        green = item;

        greenPath = green.children[0];

        green.pivot = new Point(195, 250);

        greenPos.position.x = -1000;
        greenPos.position.y = -1000;
        greenPos.rotation = -720;

        _.merge(green, greenPos);

        project.importSVG('orange.svg', {
            onLoad: function(item) {
                orange = item;

                orangePath = orange.children[0];

                orange.pivot = new Point(270, 250);

                orangePos.position.x = view.size.width + 1000;
                orangePos.position.y = view.size.height + 1000;
                orangePos.rotation = 720;

                _.merge(orange, orangePos);

                onLoaded();
            }
        });
    }
});

function onLoaded() {

    TweenMax.to([greenPos, greenPos.position], 1, {
        rotation: greenEnd.rotation,
        x: greenEnd.position.x,
        y: greenEnd.position.y
    });

    TweenMax.to([orangePos, orangePos.position], 1, {
        rotation: orangeEnd.rotation,
        x: orangeEnd.position.x,
        y: orangeEnd.position.y
    });

    setTimeout(function() {
        finished = true;
    }, 1000);

    loaded = true;
}

intersection = new Path();
greenClone = new Path();
orangeClone = new Path();

function onFrame(event) {
    if (loaded) {

        if (finished) {
            greenPos.rotation += 0.25;
            orangePos.rotation += 0.25;
        }

        _.merge(green, greenPos);
        _.merge(orange, orangePos);

        greenClone.remove();
        greenClone = greenPath.clone(false);
        project.activeLayer.addChild(greenClone);
        greenClone.matrix = green.matrix;

        orangeClone.remove();
        orangeClone = orangePath.clone(false);
        project.activeLayer.addChild(orangeClone);
        orangeClone.matrix = orange.matrix;

        try {
            intersection.remove();
            intersection = greenClone.intersect(orangeClone);
            intersection.fillColor = '#002C5B';

            greenClone.remove();
            orangeClone.remove();

        } catch (e) {
            console.log('error');
        }

    }
}

function onResize(event) {
    console.log('resize');

    greenEnd.rotation = 0;
    greenEnd.position.x = (view.size.width / 2);
    greenEnd.position.y = view.size.height / 2;

    orangeEnd.rotation = 0;
    orangeEnd.position.x = view.size.width / 2;
    orangeEnd.position.y = view.size.height / 2;

    if (finished) {
        _.merge(greenPos, greenEnd);
        _.merge(orangePos, orangeEnd);
    }
}
