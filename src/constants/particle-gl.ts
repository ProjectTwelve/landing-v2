export const rotateAroundAxis = `
mat4 rotationMatrix(vec3 axis, float angle)
{
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  
  return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
              oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
              oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
              0.0,                                0.0,                                0.0,                                1.0);
}
`;

export const noise = `
    //	Simplex 4D Noise 
  //	by Ian McEwan, Ashima Arts
  //
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}
  
  vec4 grad4(float j, vec4 ip){
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p,s;
  
    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 
  
    return p;
  }
  
  float snoise(vec4 v){
    const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                          0.309016994374947451); // (sqrt(5) - 1)/4   F4
  // First corner
    vec4 i  = floor(v + dot(v, C.yyyy) );
    vec4 x0 = v -   i + dot(i, C.xxxx);
  
  // Other corners
  
  // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
    vec4 i0;
  
    vec3 isX = step( x0.yzw, x0.xxx );
    vec3 isYZ = step( x0.zww, x0.yyz );
  //  i0.x = dot( isX, vec3( 1.0 ) );
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;
  
  //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;
  
    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;
  
    // i0 now contains the unique values 0,1,2,3 in each channel
    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );
  
    //  x0 = x0 - 0.0 + 0.0 * C 
    vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
    vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
    vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
    vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;
  
  // Permutations
    i = mod(i, 289.0); 
    float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute( permute( permute( permute (
               i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
             + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
             + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
             + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
  // Gradients
  // ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
  // 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  
    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;
  
    vec4 p0 = grad4(j0,   ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);
  
  // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4,p4));
  
  // Mix contributions from the five corners
    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
    m0 = m0 * m0;
    m1 = m1 * m1;
    return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                 + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
  
  }
    `;

export const tara64 = ` data:image/jpeg;base64,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`;
