// app/templates/tabTemplate.ts
// helper to escape HTML special chars
const escapeHTML = (str: string) =>
  str.replace(/&/g, "&amp;")
     .replace(/</g, "&lt;")
     .replace(/>/g, "&gt;")
     .replace(/"/g, "&quot;")
     .replace(/'/g, "&#039;");

export const tabTemplate = (headers: string[], contents: string[]) => `<!DOCTYPE html>
<html>
<head>
  <title>Dynamic Tabs Example</title>
</head>
<body>
  <div class="tab" style="overflow: hidden; border: 1px solid #ccc; background-color: #f1f1f1;"></div>

  <script>
    const headers = ${JSON.stringify(headers)};
    const contents = ${JSON.stringify(contents.map(c => escapeHTML(c)))};

    const tabContainer = document.querySelector(".tab");

    function openTab(evt, tabId) {
      const tabcontent = document.getElementsByClassName("tabcontent");
      for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }

      const tablinks = document.getElementsByClassName("tablinks");
      for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }

      document.getElementById(tabId).style.display = "block";
      evt.currentTarget.className += " active";
    }

    headers.forEach((header, index) => {
      const btn = document.createElement("button");
      btn.className = "tablinks";
      btn.textContent = header;
      const tabId = \`tab\${index}\`;
      btn.onclick = (evt) => openTab(evt, tabId);
      tabContainer.appendChild(btn);

      const div = document.createElement("div");
      div.id = tabId;
      div.className = "tabcontent";
      div.style = "display:none; padding:6px 12px; border:1px solid #ccc; border-top:none;";
      div.innerHTML = \`<pre style="background:#f8f8f8; overflow:auto; width:auto; border:solid gray; border-width:.1em .1em .1em .8em; padding:.2em .6em; margin:0; line-height:125%"><code>\${contents[index]}</code></pre>\`;
      document.body.appendChild(div);
    });

    window.onload = function () {
      document.querySelector(".tablinks")?.click();
    };
  </script>
</body>
</html>`;
