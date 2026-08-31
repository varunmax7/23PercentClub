import { describe, it, expect } from "vitest";
import { organizationJsonLd, articleJsonLd, jsonLdScriptContent } from "@/lib/seo";

describe("organizationJsonLd", () => {
  it("has the required schema.org shape", () => {
    const result = organizationJsonLd();
    expect(result["@type"]).toBe("Organization");
    expect(result.name).toBe("23% Club");
    expect(result.slogan).toMatch(/teach you how to manage it/i);
  });
});

describe("articleJsonLd", () => {
  it("builds a full URL from a relative path", () => {
    const result = articleJsonLd({
      headline: "Test",
      description: "Desc",
      url: "/learn/blog/test",
      author: "Saikumar",
    });
    expect(result.url).toMatch(/\/learn\/blog\/test$/);
    expect(result.author).toEqual({ "@type": "Person", name: "Saikumar" });
  });

  it("omits datePublished and image when not provided", () => {
    const result = articleJsonLd({ headline: "T", description: "D", url: "/x", author: "A" });
    expect(result).not.toHaveProperty("datePublished");
    expect(result).not.toHaveProperty("image");
  });
});

describe("jsonLdScriptContent", () => {
  it("escapes a literal </script> sequence in a string value", () => {
    const evil = { headline: "</script><script>alert(1)</script>" };
    const output = jsonLdScriptContent(evil);
    expect(output).not.toContain("</script>");
    expect(output).toContain("\\u003c/script>");
  });

  it("produces valid JSON once unescaped", () => {
    const data = { a: 1, b: "two" };
    const output = jsonLdScriptContent(data);
    expect(JSON.parse(output.replace(/\\u003c/g, "<"))).toEqual(data);
  });
});
