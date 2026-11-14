import { isUploadedAvatar, presetById } from "@/lib/avatars";

/** Аватар пользователя: загруженная картинка, готовая аватарка или первая буква имени. */
export function Avatar({
  image,
  name,
  size = 36,
  ring,
}: {
  image: string | null | undefined;
  name: string;
  size?: number;
  ring?: string;
}) {
  const style = {
    width: size,
    height: size,
    boxShadow: ring ? `0 0 0 2px ${ring}` : undefined,
  } as const;

  if (isUploadedAvatar(image)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image ?? undefined} alt="" style={style} className="rounded-full object-cover shrink-0" />;
  }

  const preset = image?.startsWith("preset:") ? presetById(image.slice(7)) : null;
  if (preset) {
    return (
      <span
        style={{ ...style, background: preset.bg, fontSize: size * 0.5 }}
        className="rounded-full flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        {preset.emoji}
      </span>
    );
  }

  return (
    <span
      style={{ ...style, fontSize: size * 0.42 }}
      className="rounded-full flex items-center justify-center shrink-0 bg-raised border border-line font-medium"
      aria-hidden="true"
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}
