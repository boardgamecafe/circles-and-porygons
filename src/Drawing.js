import {fromJS} from "immutable";
import React from "react";
import Firebase from 'firebase';

/*
    Draw the polygons as SVG, recognizing
    whether they are circles beforehand

    lines: collection of strokes (points)
    color: list of colors corresponding to each stroke
    width: list of widths corresponding to each stroke
    isDrawing: boolean indicating if they user is currently drawing
 */

export default function Drawing({ lines, color, fill, isDrawing, width }) {
    const toZip = fromJS([lines, color, fill, width]);
    const zipped = toZip.get(0).zip(...toZip.rest());
    console.log("drawing");
    return (
        <svg className="drawing">
            {zipped.map((line, index) => (
                <DrawingLine key={index} line={line[0]} color={line[1]} fill={line[2]} width={line[3]}/>
                )
            )}
        </svg>
    );
}


function DrawingLine({ line, color, fill, width }) {

    const pathData = "M " +
        line
            .map(p => {
                return `${p.get('x')} ${p.get('y')}`;
            })
            .join(" L ");

    return <path className="path" d={pathData} fill={fill} stroke={color} strokeWidth={width} />;
}