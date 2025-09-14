

async function navigateTo(pagePath) {
  const main = document.getElementById("app-main");

  try {
    const response = await fetch(pagePath);
    if (!response.ok) throw new Error("Erro ao carregar " + pagePath);

    const html = await response.text();
    main.innerHTML = html;


    window.scrollTo(0, 0);
  } catch (err) {
    console.error(err);
    main.innerHTML = "<p>Erro ao carregar a página.</p>";
  }
}
