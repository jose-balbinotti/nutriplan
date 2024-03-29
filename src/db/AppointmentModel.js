import { db } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

class AppointmentModel {
  constructor() {
    this.table = "consulta";
  }

  async add(patient_uuid, nutritionist_uuid, date, time) {
    await addDoc(collection(db, this.table), {
      nutricionista_uuid: nutritionist_uuid,
      paciente_uuid: patient_uuid,
      data: date,
      horario: time,
    });
  }

  async getByPatientUuid(uuid) {
    const q = query(
      collection(db, this.table),
      where("paciente_uuid", "==", uuid),
      orderBy("data"),
      orderBy("horario")
    );
    const data = await getDocs(q);
    const dataResult = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return dataResult;
  }

  async getByNutritionistUuid(uuid) {
    const q = query(collection(db, this.table), where("nutricionista_uuid", "==", uuid), orderBy("data"), orderBy("horario"));
    const data = await getDocs(q);
    const dataResult = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return dataResult;
  }

  async getNotificationByPatientUuid(uuid) {
    const q = query(
      collection(db, this.table),
      where("paciente_uuid", "==", uuid),
      where("alterar", "!=", false)
    );
    const data = await getDocs(q);
    const dataResult = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return dataResult;
  }

  async getByDocId(docId) {
    const docRef = doc(db, this.table, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
  }

  async delete(docId) {
    let data = await this.getByDocId(docId)
    await deleteDoc(doc(db, this.table, docId));
    return data
  }

  async update(docId, appoint) {
    await updateDoc(doc(db, this.table, docId), appoint);
  }
}

export default AppointmentModel;
