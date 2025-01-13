export default function argsort(arr: number[], reversed?: boolean): number[] {
    return arr
        .map((item, index) => [index, item]) // add the args to sort by
        .sort(([index1, item1], [index2, item2]) =>
            reversed ? item2 - item1 : item1 - item2
        ) // sort by the args
        .map(([index, item]) => index); // extract the sorted items
}
