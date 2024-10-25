const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {};

// fitur buat folder (make-folder)
app.makeFolder = () => {
  rl.question("Masukan Nama Folder : ", (folderName) => {
    const folderPath = path.join(__dirname, folderName);
    if (fs.existsSync(folderPath)) {
      console.log("Folder Sudah Ada");
    } else {
      fs.mkdirSync(folderPath);
      console.log(`folder ${folderName} berhasil dibuat`);
    }
    rl.close();
  });
};

// To Do : lanjutkan pembuatan logic disini

// fitur buat file dalam folder yang ditentukan (make-file)
app.makeFile = () => {
  rl.question("Masukkan Nama Folder: ", (folderName) => {
    const folderPath = path.join(__dirname, folderName);

    // meriksa apakah folder tidak ada
    if (!fs.existsSync(folderPath)) {
      console.log("Folder tidak ditemukan");
      rl.close();
      return;
    }

    rl.question("Masukkan Nama File (dengan ekstensinya): ", (fileName) => {
      const filePath = path.join(folderPath, fileName);

      // meriksa apakah file sudah ada
      if (fs.existsSync(filePath)) {
        console.log("File sudah ada");
      } else {
        fs.writeFileSync(filePath, "");
        console.log(`File ${fileName} berhasil dibuat di folder ${folderName}`);
      }
      rl.close();
    });
  });
};

//fitur merapikan folder berdasarkan ekstensinya (ext-sorter)
app.extSorter = () => {
  const unorganizeFolder = path.join(__dirname, "unorganize_folder");

  if (!fs.existsSync(unorganizeFolder)) {
    console.error("Folder 'unorganize_folder' tidak ditemukan");
    return;
  }

  const files = fs.readdirSync(unorganizeFolder);

  // Kategori file berdasarkan ekstensi
  const fileCategories = {
    text: [".txt", ".doc", ".docx", ".pdf", ".md"],
    image: [".jpg", ".jpeg", ".png", ".gif"],
    video: [".mp4", ".mkv", ".avi", ".mov"],
    audio: [".mp3", ".wav", ".ogg"],
    archive: [".zip", ".rar", ".tar"],
    others: [],
  };

  // Mengurutkan file berdasarkan ekstensi
  files.forEach((file) => {
    const ext = path.extname(file).toLowerCase();
    let category = "others";

    for (const [cat, exts] of Object.entries(fileCategories)) {
      if (exts.includes(ext)) {
        category = cat;
        break;
      }
    }

    // Mengatur path folder tujuan ke folder yang sudah ada di luar unorganize_folder
    const destFolder = path.join(__dirname, category); // Menggunakan nama kategori sebagai folder tujuan

    // ngecek apakah folder tujuan ada.
    if (!fs.existsSync(destFolder)) {
      console.warn(
        `Folder tujuan ${category} tidak ditemukan. File ${file} tidak dipindahkan.`
      );
      return; // Lanjutkan ke file berikutnya jika folder tidak ada
    }

    // Mengubah path file ke path folder tujuan
    const oldPath = path.join(unorganizeFolder, file);
    const newPath = path.join(destFolder, file);

    try {
      fs.renameSync(oldPath, newPath);
      console.log(`File ${file} berhasil diorganisasi ke folder ${category}`);
    } catch (err) {
      console.error(`Gagal mengorganisasi file ${file}: ${err.message}`);
    }
  });
};

// fitur membaca folder (read-folder)
app.readFolder = () => {
  rl.question("Masukkan Nama Folder: ", (folderName) => {
    const folderPath = path.join(__dirname, folderName);
    if (!fs.existsSync(folderPath)) {
      console.error("Folder tidak ditemukan.");
      rl.close();
      return;
    }

    const files = fs.readdirSync(folderPath);

    // Kategori file berdasarkan ekstensi
    const fileCategories = {
      text: [".txt", ".pdf", ".docx", ".md"],
      image: [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
      video: [".mp4", ".avi", ".mkv", ".mov"],
      audio: [".mp3", ".wav", ".ogg"],
      archive: [".zip", ".rar", ".7z", ".tar"],
      others: [], // Untuk file yang tidak termasuk kategori
    };

    const fileDetails = files.map((file) => {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);
      const ext = path.extname(file).toLowerCase();
      const size = (stats.size / 1024).toFixed(2) + "kb"; // Ukuran dalam kb

      // nentuin kategori file berdasarkan ekstensi
      let jenisFile = "others"; // Kategori default
      for (const [category, extensions] of Object.entries(fileCategories)) {
        if (extensions.includes(ext)) {
          jenisFile = category;
          break;
        }
      }

      return {
        namaFile: file,
        extensi: ext.substring(1),
        jenisFile: jenisFile,
        tanggalDibuat: stats.birthtime.toISOString().split("T")[0],
        ukuranFile: size,
      };
    });

    console.log(`Berhasil menampilkan isi dari folder ${folderName}:`);
    console.log(JSON.stringify(fileDetails, null, 2));
    rl.close();
  });
};

// fitur membaca file (read-file)
app.readFile = () => {
  rl.question("Masukkan Nama Folder: ", (folderName) => {
    rl.question("Masukkan Nama File (dengan ekstensi): ", (fileName) => {
      const folderPath = path.join(__dirname, folderName); // Dapatkan path folder
      const filePath = path.join(folderPath, fileName); // Gabungkan dengan nama file

      if (!fs.existsSync(folderPath)) {
        console.error("Folder tidak ditemukan.");
        rl.close();
        return;
      }

      if (!fs.existsSync(filePath)) {
        console.error("File tidak ditemukan.");
        rl.close();
        return;
      }

      const ext = path.extname(fileName).toLowerCase();
      if (ext === ".txt" || ext === ".md") {
        const content = fs.readFileSync(filePath, "utf8");
        console.log(`Isi dari file ${fileName}:\n`);
        console.log(content);
      } else {
        console.log("Hanya mendukung pembacaan file text (.txt, .md).");
      }
      rl.close();
    });
  });
};

module.exports = app;
