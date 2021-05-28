const quicksort = function(array, compare) {
  let len = array.length;
  if (len < 2) {
    return array;
  }
  let pivot = Math.ceil(len / 2);
  return merge(quicksort(array.slice(0, pivot), compare), quicksort(array.slice(pivot), compare), compare);
};

const merge = function(left, right, compare) {
  let result = [];
  while (left.length > 0 && right.length > 0) {
    let r = compare ? compare(left[0], right[0]) < 0 : left[0] < right[0];
    if (r) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }

  result = result.concat(left, right);
  return result;
};

export default quicksort;
