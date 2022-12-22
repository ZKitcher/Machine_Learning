class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return (
            point.x >= this.x - this.w &&
            point.x < this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y < this.y + this.h
        );
    }

    intersects(range) {
        return !(
            range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h
        );
    }

    show() {
        stroke(255);
        noFill();
        strokeWeight(1);
        rectMode(CENTER);

        if (this.x < this.w / 2) {
            rect(this.x + width, this.y, this.w, this.h);
        }
        if (this.x > width - this.w / 2) {
            rect(this.x - width, this.y, this.w, this.h);
        }
        if (this.y < this.h / 2) {
            rect(this.x, this.y + height, this.w, this.h);
        }
        if (this.y > this.h / 2) {
            rect(this.x, this.y - height, this.w, this.h);
        }
        if (this.x < this.w / 2 && this.y < this.h / 2) {
            rect(this.x + width, this.y + height, this.w, this.h);
        }
        if (this.x > width - this.w / 2 && this.y > this.h / 2) {
            rect(this.x - width, this.y - height, this.w, this.h);
        }
        rect(this.x, this.y, this.w, this.h);
    }
}

class QuadTree {
    constructor(boundary, n, nested = 1) {
        this.boundary = boundary;
        this.capacity = n;
        this.points = [];
        this.divided = false;
        this.nested = nested;
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;
        let ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
        this.northeast = new QuadTree(ne, this.capacity, this.nested + 1);
        let nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
        this.northwest = new QuadTree(nw, this.capacity, this.nested + 1);
        let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
        this.southeast = new QuadTree(se, this.capacity, this.nested + 1);
        let sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
        this.southwest = new QuadTree(sw, this.capacity, this.nested + 1);
        this.divided = true;
    }

    insert(point) {
        if (!this.boundary.contains(point.position)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }
            if (this.northeast.insert(point)) {
                return true;
            } else if (this.northwest.insert(point)) {
                return true;
            } else if (this.southeast.insert(point)) {
                return true;
            } else if (this.southwest.insert(point)) {
                return true;
            }
        }
    }

    query(range, found) {
        if (!found) {
            found = [];
        }
        if (!this.boundary.intersects(range)) {
            return;
        } else {
            for (let i = 0; i < this.points.length; i++) {
                if (range.contains(this.points[i].position)) {
                    found.push(this.points[i]);
                }
            }
            if (this.divided) {
                this.northwest.query(range, found);
                this.northeast.query(range, found);
                this.southwest.query(range, found);
                this.southeast.query(range, found);
            }
        }
        return found;
    }

    getEachItem(found) {
        if (!found) {
            found = [];
        }
        for (let i = 0; i < this.points.length; i++) {
            found.push(this.points[i]);
        }
        if (this.divided) {
            this.northwest.getEachItem(found);
            this.northeast.getEachItem(found);
            this.southwest.getEachItem(found);
            this.southeast.getEachItem(found);
        }
        return found;
    }

    runEachItem(...items) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].run();
        }
        if (this.divided) {
            this.northwest.runEachItem(...items);
            this.northeast.runEachItem(...items);
            this.southwest.runEachItem(...items);
            this.southeast.runEachItem(...items);
        }
    }

    filterTree(parameter, condition) {
        const needsFilter = this.findCondition(parameter, condition);
        if (needsFilter) {
            const tempItems = this.getEachItem();
            const boundary = new Rectangle(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h)
            let newTree = new QuadTree(boundary, this.capacity);


            const filter = []
            for (let i = 0; i < tempItems.length; i++) {
                let e = tempItems[i];

                if (e[parameter] === condition) {
                    filter.push(e)
                }
            }

            filter
                .sort((a, b) => b.strength - a.strength)
                .forEach(e => newTree.insert(e))

            return newTree;
        }
        return this;
    }

    findCondition(parameter, condition) {
        let filteredTemp = this.points.findIndex(e => e[parameter] !== condition);
        if (filteredTemp !== -1) return true;

        if (this.divided) {
            this.northwest.filterTree(parameter, condition);
            this.northeast.filterTree(parameter, condition);
            this.southwest.filterTree(parameter, condition);
            this.southeast.filterTree(parameter, condition);
        }
    }

    render() {
        push()
        stroke(255);
        noFill();
        strokeWeight(1);
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);

        if (this.divided) {
            this.northeast.render();
            this.northwest.render();
            this.southeast.render();
            this.southwest.render();
        }
        pop()
    }
}