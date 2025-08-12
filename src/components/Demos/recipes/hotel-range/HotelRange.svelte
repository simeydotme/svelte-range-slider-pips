<script>
  import RangeSlider from "svelte-range-slider-pips";
  import { sampleSkewedNormal } from "./HotelRange.ts";
  import css from "./HotelRange.css?inline";
  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */

  let values = [ 200, 400 ];

  const bucketSize = 10;
  const minPrice = 40;
  const maxPrice = 800;

  // Generate random number of hotels 
  // (would normally be fetched from an API)
  const numHotels = Math.floor(Math.random() * 300) + 900;

  // Generate imaginary hotels with prices from skewed normal distribution
  // (would normally be fetched from an API)
  const hotels = Array.from({ length: numHotels }, () => {
    const sampledPrice = sampleSkewedNormal({
      min: minPrice,
      max: maxPrice,
      mean: 200,
      stdDev: 120,
      skewness: 0.7,
    });
    return { price: sampledPrice };
  });

  // Create price buckets based on the bucket size
  const priceBuckets = Array.from({ length: 81 }, (_, i) => {
    const bucketMin = i * bucketSize;
    const bucketMax = bucketMin + bucketSize;

    // Count hotels in this price range
    const hotelsInBucket = hotels.filter((hotel) => hotel.price >= bucketMin && hotel.price <= bucketMax).length;

    return {
      priceRange: `${bucketMin}-${bucketMax}`,
      minPrice: bucketMin,
      maxPrice: bucketMax,
      numHotels: hotelsInBucket,
    };
  });

  // Add a span with the number of hotels for a given bucket, 
  // and style the height (--h) of the span to match the number of hotels
  const formatter = (value, index) => {
    const hotelCount = priceBuckets[index].numHotels;
    const min = priceBuckets[index].minPrice;
    const max = priceBuckets[index].maxPrice;
    return `
      <span class='hotel-range-label' style='--h:${hotelCount}'>
        <span class='hotel-range-label-number'>
          ${hotelCount} hotels @ $${min}-$${max}
        </span>
      </span>
    `;
  };

  // Format the number of hotels between a given range
  const rangeFormatter = (valueMin, valueMax) => {
    const hotelsInRange = priceBuckets.filter((b) => b.minPrice >= valueMin).filter((b) => b.minPrice <= valueMax);
    const hotelCount = hotelsInRange.reduce((acc, b) => acc + b.numHotels, 0);
    return `${hotelCount} hotels`;
  };

  // Format the value of the handle
  const handleFormatter = (value) => {
    return `$${value}`;
  };
</script>

<div class="container">
  <RangeSlider
    id="hotel-range"
    bind:values
    min={0}
    max={maxPrice}
    step={bucketSize}
    pipstep={1}
    pips
    range
    rangeFloat
    float
    draggy
    all="label"
    {formatter}
    {rangeFormatter}
    {handleFormatter}
  />

  <div class="fields">
    <div class="field">
      <label for="min-price">Min price</label>
      <input type="number" id="min-price" bind:value={values[0]} step={bucketSize} />
    </div>
    <hr>
    <div class="field">
      <label for="max-price">Max price</label>
      <input type="number" id="max-price" bind:value={values[1]} step={bucketSize} />
    </div>
  </div>

  <p>There are <strong>{rangeFormatter(values[0], values[1])}</strong> available 
    between <strong>${values[0]}</strong> and <strong>${values[1]}</strong>.</p>
</div>

<!-- hide -->
{@html renderCss}
<!-- endhide -->
