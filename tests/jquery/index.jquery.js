$(function () {
  const slider = document.querySelector('.my-slider');
  const rangeSliderPips = new RangeSliderPips({
    target: slider,
    props: {
      pips: true,
      all: 'label',
      float: true
    }
  });
});
