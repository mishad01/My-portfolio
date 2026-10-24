import { Button, Switch } from '@/ui';
import { FieldInput } from '../components/FieldInput';
import { Preview } from '../components/Preview';
import { FIELDS } from '../schema';
import type { AdminVM } from '../useAdmin';

/** Form on the left, live preview on the right. */
export function EditScreen({ vm }: { vm: AdminVM }) {
  const form = vm.form!;
  const published = form.status === 'published';
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-6">
      <div className="flex flex-col gap-4 rounded-[28px] bg-surface-low p-7">
        {FIELDS[vm.sec].map((f) => (
          <FieldInput key={f.k} f={f} value={form[f.k]} onChange={(v) => vm.setField(f.k, v)} onUpload={(file) => vm.upload(file, f.k, f.type === 'images')} uploading={vm.busy === 'upload:' + f.k} />
        ))}
        {!vm.meta.single && (
          <div className="mt-1 border-t border-outline-variant">
            <Switch
              checked={published}
              onChange={(v) => vm.setField('status', v ? 'published' : 'draft')}
              label={published ? 'Published' : 'Draft'}
              supporting={published ? 'Visible on the live site after you publish' : 'Hidden from the site'}
            />
          </div>
        )}
        <div className="mt-2 flex flex-wrap justify-end gap-3">
          <Button variant="outlined" size="md" onClick={vm.discard}>Discard</Button>
          <Button size="md" icon="check" onClick={vm.save}>Save</Button>
        </div>
      </div>
      <Preview sec={vm.sec} form={form} showDraft={!vm.meta.single && !published} />
    </div>
  );
}
