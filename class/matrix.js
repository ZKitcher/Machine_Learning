class Matrix {
    constructor(rows = 2, columns = 2) {
        this.rows = rows;
        this.columns = columns;
        this.data = [];

        for (let i = 0; i < this.rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < this.columns; j++) {
                this.data[i][j] = 0;
            }
        }
    }

    static fromArray = (array) => {
        let m = new Matrix(array.length, 1)
        for (let i = 0; i < array.length; i++) {
            m.data[i][0] = array[i];
        }
        return m;
    }

    static multiply = (a, b) => {
        if (a.columns !== b.rows) {
            console.error('Columns must match number of Rows.')
            return undefined;
        }

        let result = new Matrix(a.rows, b.columns);

        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.columns; j++) {
                let sum = 0;
                for (let k = 0; k < a.columns; k++) {
                    sum += a.data[i][k] * b.data[k][j]
                }
                result.data[i][j] = sum
            }
        }
        return result;
    }


    static subtract = (a, b) => {
        let result = new Matrix(a.rows, a.columns);

        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.columns; j++) {
                result.data[i][j] = a.data[i][j] - b.data[i][j]
            }
        }
        return result;
    }

    static transpose = (matrix) => {
        let result = new Matrix(matrix.columns, matrix.rows);
        for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.columns; j++) {
                result.data[j][i] = matrix.data[i][j];
            }
        }
        return result
    }

    static map = (matrix, fn) => {
        let result = new Matrix(matrix.rows, matrix.columns);

        for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.columns; j++) {
                let value = matrix.data[i][j];
                result.data[i][j] = fn(value, i, j);
            }
        }
        return result;
    }

    toArray = () => {
        let array = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                array.push(this.data[i][j]);
            }
        }
        return array;
    }

    map = (fn) => {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                let value = this.data[i][j];
                this.data[i][j] = fn(value, i, j);
            }
        }
    }

    multiply = (n) => {
        if (n instanceof Matrix) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.columns; j++) {
                    this.data[i][j] *= n.data[i][j];
                }
            }
        } else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.columns; j++) {
                    this.data[i][j] *= n;
                }
            }
        }
    }

    add = (n) => {
        if (n instanceof Matrix) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.columns; j++) {
                    this.data[i][j] += n.data[i][j];
                }
            }
        } else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.columns; j++) {
                    this.data[i][j] += n;
                }
            }
        }
    }

    randomise = () => {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.data[i][j] = Math.random() * 2 - 1;
            }
        }
    }

    print = () => {
        console.table(this.data)
    }

}

