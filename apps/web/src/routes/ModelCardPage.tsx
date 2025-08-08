export function ModelCardPage() {
  return (
    <div className="prose max-w-none">
      <h2>Model card</h2>
      <p>
        This app uses an object detection model to identify plant diseases on leaf images. Predictions
        include bounding boxes, labels, and confidence scores.
      </p>
      <h3>Intended use</h3>
      <ul>
        <li>Educational and demo purposes</li>
        <li>Rough triage hints for plant care</li>
      </ul>
      <h3>Limitations</h3>
      <ul>
        <li>Performance depends on lighting, image quality, and plant species.</li>
        <li>Not all diseases or conditions are covered.</li>
        <li>Confidence is not calibrated; treat as relative likelihood.</li>
      </ul>
      <h3>Disclaimer</h3>
      <p>
        This tool is not a substitute for professional agronomic advice. Use at your own risk.
      </p>
    </div>
  );
}