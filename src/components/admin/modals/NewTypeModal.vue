<template>
  <BaseModal
    :show="props.show"
    title="Create Product Type"
    :createForm="createForm"
    :validateForm="validateForm"
    @close="emit('close')"
    @submit="handleSubmit"
  >
    <template #default="{ form }">
      <label>Name</label>
      <input v-model="form.name" type="text" required placeholder="Type name" />

      <div>
        <label>Attributes</label>
        <div v-for="(attr, index) in form.attributes" :key="index" style="margin-bottom: 8px">
          <input v-model="attr.name" type="text" placeholder="Attribute Name" required />
          <select v-model="attr.dataType" required style="margin-bottom: 0; margin-top: 0">
            <option disabled value="">Select Data Type</option>
            <option value="string">Text</option>
            <option value="int">Number</option>
            <option value="decimal">Decimal</option>
            <option value="DateTime">Date</option>
            <option value="bool">True/False</option>
          </select>
          <button
            type="button"
            @click="() => removeAttribute(form, index)"
            style="
              margin-left: 8px;
              background: #eee;
              color: #a36a6a;
              border: none;
              border-radius: 4px;
              padding: 2px 8px;
              cursor: pointer;
            "
          >
            Remove
          </button>
        </div>
        <button type="button" @click="() => addAttribute(form)">+ Add Attribute</button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'submit'])

function createForm() {
  return {
    name: '',
    attributes: [],
  }
}

function validateForm(form) {
  if (!form.name) return false
  return form.attributes.length > 0 && form.attributes.every((attr) => attr.name && attr.dataType)
}

function addAttribute(form) {
  form.attributes.push({
    name: '',
    dataType: '',
  })
}

function removeAttribute(form, index) {
  form.attributes.splice(index, 1)
}

function handleSubmit(data) {
  emit('submit', data)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 32px 32px 24px 32px;
  border-radius: 12px;
  width: 420px;
  box-shadow: 0 4px 24px rgba(90, 24, 24, 0.12);
  color: #5a1818;
  font-family: inherit;
}

.modal h2 {
  color: #5a1818;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  letter-spacing: 1px;
}

.modal label {
  color: #7a2a2a;
  font-weight: 600;
  margin-bottom: 0.3rem;
  display: block;
  margin-top: 1rem;
}

.modal input {
  display: block;
  width: 100%;
  margin-bottom: 18px;
  padding: 10px 12px;
  border: 1.5px solid #bdbdbd;
  border-radius: 6px;
  font-size: 1rem;
  background: #faf7f7;
  color: #5a1818;
  transition: border 0.2s;
}

.modal input:focus {
  outline: none;
  border-color: #a36a6a;
  background: #fff;
}

.modal select {
  display: block;
  width: 100%;
  margin-bottom: 18px;
  padding: 10px 12px;
  border: 1.5px solid #bdbdbd;
  border-radius: 6px;
  font-size: 1rem;
  background: #faf7f7;
  color: #5a1818;
  transition: border 0.2s;
}

.modal select:focus {
  outline: none;
  border-color: #a36a6a;
  background: #fff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}

.modal-actions button,
.modal button[type='button'] {
  background: #5a1818;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.modal-actions button:hover,
.modal button[type='button']:hover {
  background: #a36a6a;
}

.modal button[type='button'] {
  margin-top: 0.3rem;
  margin-bottom: 0.7rem;
  background: #a36a6a;
  color: #fff;
  padding: 6px 14px;
  font-size: 0.95rem;
}

.modal button[type='button']:hover {
  background: #5a1818;
}
</style>
