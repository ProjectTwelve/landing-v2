import { Vector3 } from "three"
/**
 * @param point 
 * @param pol1 the first point on the line
 * @param pol2 the second point on the line, pol1 and pol2 muse be different
 * @returns distance between point and the line defined by pol1 & pol2
 * @reference https://mathworld.wolfram.com/Point-LineDistance3-Dimensional.html
 */
export function calculateDistance(point: Vector3, pol1: Vector3, pol2: Vector3) { // pol: PointOnLine
    var diff1 = new Vector3(0,0,0).subVectors(point, pol1)
    var diff2 = new Vector3(0,0,0).subVectors(point, pol2)
    var cross = new Vector3(0,0,0).crossVectors(diff1, diff2)
    var diff3 = new Vector3(0,0,0).subVectors(pol2, pol1)
    return cross.length() / diff3.length()
}
