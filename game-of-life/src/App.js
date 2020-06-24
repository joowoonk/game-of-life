import React, { useState, useEffect, useCallback, useRef } from "react";
import produce from "immer";
import "./App.scss";
// import { parset } from "./Parset";
// import { cross } from "./cross";
// import { timesquare } from "./timesquare";
import { shoe } from "./presets/shoe";
import { fox } from "./presets/fox";
import { cross } from "./presets/cross";
import { bridge } from "./presets/bridge";
import { timesquare } from "./presets/timesquare";

const numRows = 50;
const numCols = 50;
const operations = Array(9)
  .fill(1)
  .map((i, k) => [Math.floor(k / 3) - 1, (k % 3) - 1]);

const generateEmptyGrid = () => {
  //setting the state
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const App = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState();
  const [once, setOnce] = useState(true);
  const [count, setCount] = useState(0);
  const runningRef = useRef(running);
  const [isStopping, setIsStopping] = useState(true);
  runningRef.current = running;
  const [speed, setSpeed] = useState(100);

  const onInputSpeed = (e) => {
    setSpeed(e.target.value);
  };
  //useCallback will help function to run once
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        //simulate
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;

            // if (gridCopy[i][k + 1] === 1) {
            //   neighbors += 1;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;

              //checking if the grid is out of boud...
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            //if the current grid doesnt suround by around grids more than 2, it dies.
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;

              // or else dead cell can go back to live if there are 3 cells around the current grid
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    // const newGrid = produce();

    setTimeout(runSimulation, document.getElementById("speed").value * 100);
  }, []);
  useEffect(() => {
    if (!isStopping) {
      const id = window.setInterval(() => {
        setCount((count) => count + 1);
      }, document.getElementById("speed").value * 100);

      return () => window.clearInterval(id);
    } else {
    }
  }, [isStopping]);

  console.log(grid);
  return (
    <>
      <h2 className="title">Coway's Game of Life</h2>
      <div className="page">
        <div className="generation">
          <h1>Generation:{count}</h1>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${numCols}, 20px)`,
            }}
          >
            {grid.map((rows, i) =>
              rows.map((col, k) => (
                <button
                  key={`${i}-${k}`}
                  disabled={!once}
                  onClick={() => {
                    const newGrid = produce(grid, (gridCopy) => {
                      gridCopy[i][k] = grid[i][k] ? 0 : 1;
                    });
                    setGrid(newGrid);
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: grid[i][k] ? "skyblue" : undefined,
                    border: "solid 1px black",
                  }}
                />
              ))
            )}
          </div>

          {running && (
            <button
              className="controller"
              onClick={() => {
                setRunning(!running);
                if (!running) {
                  runningRef.current = true;
                  runSimulation();
                }
                setOnce(true);
                setIsStopping(true);
              }}
            >
              stop
            </button>
          )}
          {!running && (
            <button
              className="controller"
              onClick={() => {
                setRunning(!running);
                if (!running) {
                  runningRef.current = true;
                  runSimulation();
                }
                setOnce(false);
                setIsStopping(false);
              }}
            >
              start
            </button>
          )}
          <button
            className="controller"
            onClick={() => {
              setGrid(generateEmptyGrid());
              setOnce(true);
              setRunning(false);
              setCount(0);
              setIsStopping(true);
            }}
          >
            Clear
          </button>
          <button
            className="controller"
            onClick={() => {
              //setting the state
              const rows = [];
              for (let i = 0; i < numRows; i++) {
                rows.push(
                  Array.from(Array(numCols), () =>
                    Math.random() > 0.7 ? 1 : 0
                  )
                );
              }
              setGrid(rows);
            }}
          >
            Random
          </button>
          <input
            type="number"
            // value={speed}
            // type=""
            id="speed"
            className="controller"
            // onChage={onInputSpeed}
            placeholder="tenth of second"
          />
        </div>

        <div className="preset">
          <h1>Presets</h1>
          <button
            onClick={() => {
              //setting the state
              const rows = bridge;

              setGrid(rows);
            }}
          >
            bridge
          </button>
          <button
            onClick={() => {
              //setting the state
              const rows = cross;

              setGrid(rows);
            }}
          >
            cross
          </button>
          <button
            onClick={() => {
              //setting the state
              const rows = shoe;

              setGrid(rows);
            }}
          >
            shoe
          </button>
          <button
            onClick={() => {
              //setting the state
              const rows = fox;

              setGrid(rows);
            }}
          >
            fox
          </button>
          <button
            onClick={() => {
              //setting the state
              const rows = timesquare;

              setGrid(rows);
            }}
          >
            timesquare
          </button>
        </div>
        <div className="rules">
          <h1>Rules</h1>
          <p>
            The universe of the Game of Life is an infinite, two-dimensional
            orthogonal grid of square cells, each of which is in one of two
            possible states, live or dead, (or populated and unpopulated,
            respectively). Every cell interacts with its eight neighbours, which
            are the cells that are horizontally, vertically, or diagonally
            adjacent. At each step in time, the following transitions occur:
          </p>
          <ul>
            <li>
              Any live cell with fewer than two live neighbours dies, as if by
              underpopulation.
            </li>
            <li>
              Any live cell with two or three live neighbours lives on to the
              next generation.
            </li>
            <li>
              Any live cell with more than three live neighbours dies, as if by
              overpopulation.
            </li>
            <li>
              Any dead cell with exactly three live neighbours becomes a live
              cell, as if by reproduction.
            </li>
          </ul>
          <p>
            These rules, which compare the behavior of the automaton to real
            life, can be condensed into the following:
          </p>
          <ul>
            <li>Any live cell with two or three live neighbours survives.</li>
            <li>
              Any dead cell with three live neighbours becomes a live cell.
            </li>
            <li>
              All other live cells die in the next generation. Similarly, all
              other dead cells stay dead.
            </li>
          </ul>
          <p>
            The initial pattern constitutes the seed of the system. The first
            generation is created by applying the above rules simultaneously to
            every cell in the seed; births and deaths occur simultaneously, and
            the discrete moment at which this happens is sometimes called a
            tick. Each generation is a pure function of the preceding one. The
            rules continue to be applied repeatedly to create further
            generations.
          </p>
          <p className="refer">-from wikipedia</p>
        </div>
      </div>
    </>
  );
};

export default App;
