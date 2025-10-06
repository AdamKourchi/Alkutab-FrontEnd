import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private colors = [
    '#d32f2f', // red
    '#1976d2', // blue
    '#388e3c', // green
    '#f57c00', // orange
    '#7b1fa2', // purple
    '#0097a7', // teal
    '#c2185b', // pink
    '#5d4037', // brown
  ];

  getColorForPath(pathId: number): string {
    // Use modulo to cycle through colors based on path ID
    return this.colors[pathId % this.colors.length];
  }

  getColorForCourse(courseId: number, pathId: number): string {
    // Use the path's color but with different opacity/shade
    const baseColor = this.getColorForPath(pathId);
    return this.adjustColorBrightness(baseColor, 20); // Make it slightly lighter
  }

  private adjustColorBrightness(hex: string, percent: number): string {
    // Convert hex to RGB
    let r = parseInt(hex.substring(1,3), 16);
    let g = parseInt(hex.substring(3,5), 16);
    let b = parseInt(hex.substring(5,7), 16);

    // Make lighter
    r = Math.min(255, Math.floor(r * (1 + percent/100)));
    g = Math.min(255, Math.floor(g * (1 + percent/100)));
    b = Math.min(255, Math.floor(b * (1 + percent/100)));

    // Convert back to hex
    const rr = r.toString(16).padStart(2, '0');
    const gg = g.toString(16).padStart(2, '0');
    const bb = b.toString(16).padStart(2, '0');

    return `#${rr}${gg}${bb}`;
  }
} 