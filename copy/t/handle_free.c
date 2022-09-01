#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <stdio.h>
#include <dirent.h>
#include <errno.h>
#include <signal.h>
#include "main.h"

/**
 * handle_free - frees a list of single or double pointers to char, safely.
 * @type: a string specifying the number of
 * pointers and the type of free operation to be performed on them.
 * @flag: an int determining whether to free the pointer
 * to the command pathname in the array of command-line argument.
 *
 * Description: the string type may consist of any of a sequence
 * of the characters 's', 'd', and 'e' in the order of the
 * passing of the pointers to be freed, and with the following meanings:
 * s: free a pointer to char directly.
 * d: free a pointer to pointer to char (double pointer) directly.
 * e: free the elements (storing a dynamically allocated address)
 * of the double pointer first; then free the
 * double pointer itself. The double pointer has to be NULL-terminated.
 */
void handle_free(char *type, int flag, ...)
{
	int i;
	char *ptc, **pptc;
	va_list ap;

	va_start(ap, flag);
	for (i = 0; i < (_strlen(type)); i++)
	{
		switch (type[i])
		{
			case 's':
				ptc = va_arg(ap, char *);
				if (ptc && flag)
				{
					free(ptc);
				}
				break;
			case 'd':
				pptc = va_arg(ap, char **);
				if (pptc)
				{
					free(pptc);
				}
				break;
			case 'e':
				pptc = va_arg(ap, char **);
				if (pptc)
				{
					for (i = 0; pptc[i]; i++)
					{
						free(pptc[i]);
					}
					free(pptc);
				}
		}
	}
	va_end(ap);
}
