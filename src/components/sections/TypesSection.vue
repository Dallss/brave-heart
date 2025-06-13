<template>
  <base-section>
    <div class="extinguisher-table-title">
      <h2>Fire Extinguisher Types</h2>
    </div>
    <div class="extinguisher-table-wrapper">
      <table class="extinguisher-table">
        <colgroup>
          <col style="width: 20%" />
          <col style="width: 25%" />
          <col style="width: 55%" />
        </colgroup>
        <thead>
          <tr>
            <th>Type</th>
            <th>Color Designation</th>
            <th>Use</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dry Chemical (ABC)</td>
            <td>Red body, white band</td>
            <td>
              Fires involving solid materials, liquid or liquefiable solids, gases, and electrical
              equipment
            </td>
          </tr>
          <tr>
            <td>Carbon dioxide</td>
            <td>Red body, black band</td>
            <td>
              Fires involving flammable liquids such as gasoline, oil, grease, and electrical
              equipment
            </td>
          </tr>
          <tr>
            <td>Foam</td>
            <td>Red body, blue band</td>
            <td>
              Fires involving solid materials and flammable liquids such as gasoline, oil, grease
            </td>
          </tr>
          <tr>
            <td>Halon substitute</td>
            <td>Light Green body, white band</td>
            <td>
              Fires involving solid materials, liquid or liquefiable solids, gases, and electrical
              equipment
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </base-section>
</template>

<script setup>
import BaseSection from './BaseSection.vue'
</script>

<style scoped>
.base-section {
  background-image: url('/section2bg.png');
}

.extinguisher-table-title {
  display: flex;
  align-items: center;
  color: #ffffff;
  font-size: 2.25rem;
  font-weight: 900;
  margin: 2rem;
  margin-left: 10%;
  line-height: 1.3;
  letter-spacing: 0.05em;
}

.extinguisher-table-wrapper {
  overflow-x: auto;
  padding: 1rem;
  display: flex;
  justify-content: center;
}

.extinguisher-table {
  width: 80%;
  border-collapse: collapse;
  font-family: sans-serif;
  font-size: 19px; /* Much bigger font size */
  color: white;
  table-layout: fixed; /* Forces equal-width columns */
}

.extinguisher-table th,
.extinguisher-table td {
  border: 1px solid rgba(255, 255, 255, 0.476);
  padding: 28px 20px; /* Much taller rows, slightly narrower columns */
  text-align: left;
  vertical-align: top;
  background: transparent;
  word-wrap: break-word; /* Allows wrapping inside narrow columns */
}
.extinguisher-table th {
  text-align: center;
  font-size: 22px;
}
.extinguisher-table th {
  font-weight: bold;
}
</style>
