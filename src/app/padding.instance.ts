export class Padding
{
    x;
    y;

    setCoords(x: number, y: number)
    {
        if(x) this.x = x;
        if(y) this.y = y;
    }
}